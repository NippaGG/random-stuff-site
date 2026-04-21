import fs from "fs";
import path from "path";

import { items } from "@/data/items";
import { NextResponse } from "next/server";

const SUBMISSIONS_PATH = path.join(process.cwd(), "data", "submissions.json");
const SUBMISSIONS_DIR = path.dirname(SUBMISSIONS_PATH);

let submissionMutationQueue: Promise<void> = Promise.resolve();

interface Submission {
    toolName: string;
    link: string;
    category: string;
    description: string;
    submittedAt: string;
}

function ensureSubmissionsStorage(): void {
    fs.mkdirSync(SUBMISSIONS_DIR, { recursive: true });

    if (!fs.existsSync(SUBMISSIONS_PATH)) {
        fs.writeFileSync(SUBMISSIONS_PATH, "[]\n", "utf-8");
    }
}

function readSubmissions(): Submission[] {
    ensureSubmissionsStorage();

    try {
        const raw = fs.readFileSync(SUBMISSIONS_PATH, "utf-8");
        return JSON.parse(raw) as Submission[];
    } catch {
        return [];
    }
}

function writeSubmissions(submissions: Submission[]): void {
    ensureSubmissionsStorage();
    fs.writeFileSync(
        SUBMISSIONS_PATH,
        JSON.stringify(submissions, null, 2),
        "utf-8"
    );
}

async function withSubmissionLock<T>(task: () => Promise<T> | T): Promise<T> {
    const previous = submissionMutationQueue;
    let release = () => {};

    submissionMutationQueue = new Promise<void>((resolve) => {
        release = resolve;
    });

    await previous;

    try {
        return await task();
    } finally {
        release();
    }
}

async function sendToDiscord(submission: {
    toolName: string;
    link: string;
    category: string;
    description: string;
}) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        console.error("DISCORD_WEBHOOK_URL is not set");
        return false;
    }

    const embed = {
        title: "New Tool Submission",
        color: 0xa3e635,
        fields: [
            { name: "Tool Name", value: submission.toolName, inline: true },
            { name: "Category", value: submission.category, inline: true },
            { name: "Link", value: submission.link },
            { name: "Description", value: submission.description },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "Random Stuff Site | Tool Submission" },
    };

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] }),
        });

        return response.ok;
    } catch (error) {
        console.error("Discord webhook error:", error);
        return false;
    }
}

export async function GET() {
    const submissions = readSubmissions();
    return NextResponse.json({ submissionCount: submissions.length });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { toolName, link, category, description } = body;

        const trimmedName = typeof toolName === "string" ? toolName.trim() : "";
        const trimmedLink = typeof link === "string" ? link.trim() : "";
        const trimmedCategory = typeof category === "string" ? category.trim() : "";
        const trimmedDescription =
            typeof description === "string" ? description.trim() : "";

        if (!trimmedName || !trimmedLink || !trimmedCategory || !trimmedDescription) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        let parsedLink: URL;
        try {
            parsedLink = new URL(trimmedLink);
        } catch {
            return NextResponse.json(
                { error: "Please enter a valid URL." },
                { status: 400 }
            );
        }

        if (!["http:", "https:"].includes(parsedLink.protocol)) {
            return NextResponse.json(
                { error: "Only HTTP(S) URLs are allowed." },
                { status: 400 }
            );
        }

        const existingItem = items.find(
            (item) => item.title.toLowerCase() === trimmedName.toLowerCase()
        );

        if (existingItem) {
            return NextResponse.json(
                { error: "This tool already exists in our directory!" },
                { status: 409 }
            );
        }

        const result = await withSubmissionLock(() => {
            const submissions = readSubmissions();
            const existingSubmission = submissions.find(
                (submission) =>
                    submission.toolName.toLowerCase() === trimmedName.toLowerCase()
            );

            if (existingSubmission) {
                return {
                    ok: false as const,
                    error: "This tool has already been submitted!",
                    status: 409,
                };
            }

            const newSubmission: Submission = {
                toolName: trimmedName,
                link: parsedLink.toString(),
                category: trimmedCategory,
                description: trimmedDescription,
                submittedAt: new Date().toISOString(),
            };

            submissions.push(newSubmission);
            writeSubmissions(submissions);

            return {
                ok: true as const,
                submission: newSubmission,
                submissionCount: submissions.length,
            };
        });

        if (!result.ok) {
            return NextResponse.json(
                { error: result.error },
                { status: result.status }
            );
        }

        const discordSuccess = await sendToDiscord({
            toolName: result.submission.toolName,
            link: result.submission.link,
            category: result.submission.category,
            description: result.submission.description,
        });

        if (!discordSuccess) {
            console.warn("Discord notification failed, but submission was saved.");
        }

        return NextResponse.json(
            {
                message: "Submission received!",
                submission: result.submission,
                submissionCount: result.submissionCount,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating submission:", error);
        return NextResponse.json(
            { error: "Failed to create submission" },
            { status: 500 }
        );
    }
}
