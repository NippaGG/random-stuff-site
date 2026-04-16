import { NextResponse } from "next/server";
import { items } from "@/data/items";
import fs from "fs";
import path from "path";

const SUBMISSIONS_PATH = path.join(process.cwd(), "data", "submissions.json");
const SUBMISSIONS_DIR = path.dirname(SUBMISSIONS_PATH);

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
    fs.writeFileSync(SUBMISSIONS_PATH, JSON.stringify(submissions, null, 2), "utf-8");
}

// Send a formatted embed to Discord
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
        title: "📬 New Tool Submission",
        color: 0xa3e635, // lime green to match site theme
        fields: [
            { name: "Tool Name", value: submission.toolName, inline: true },
            { name: "Category", value: submission.category, inline: true },
            { name: "Link", value: submission.link },
            { name: "Description", value: submission.description },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "Random Stuff Site • Tool Submission" },
    };

    try {
        const res = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] }),
        });

        return res.ok;
    } catch (error) {
        console.error("Discord webhook error:", error);
        return false;
    }
}

// GET /api/submit → return submission stats
export async function GET() {
    const submissions = readSubmissions();
    return NextResponse.json({ submissionCount: submissions.length });
}

// POST /api/submit → create a new submission + notify Discord
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { toolName, link, category, description } = body;

        if (!toolName || !link || !category || !description) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        const trimmedName = toolName.trim();

        // Check if tool already exists in the curated items (case-insensitive)
        const existingItem = items.find(
            (item) => item.title.toLowerCase() === trimmedName.toLowerCase()
        );

        if (existingItem) {
            return NextResponse.json(
                { error: "This tool already exists in our directory!" },
                { status: 409 }
            );
        }

        // Check if already submitted (case-insensitive)
        const submissions = readSubmissions();
        const existingSubmission = submissions.find(
            (s) => s.toolName.toLowerCase() === trimmedName.toLowerCase()
        );

        if (existingSubmission) {
            return NextResponse.json(
                { error: "This tool has already been submitted!" },
                { status: 409 }
            );
        }

        // Save the submission to the local JSON file
        const newSubmission: Submission = {
            toolName: trimmedName,
            link: link.trim(),
            category,
            description: description.trim(),
            submittedAt: new Date().toISOString(),
        };

        submissions.push(newSubmission);
        writeSubmissions(submissions);

        // Send Discord notification (non-blocking, don't fail the request)
        const discordSuccess = await sendToDiscord({
            toolName: trimmedName,
            link: link.trim(),
            category,
            description: description.trim(),
        });

        if (!discordSuccess) {
            console.warn("Discord notification failed, but submission was saved.");
        }

        return NextResponse.json(
            {
                message: "Submission received!",
                submission: newSubmission,
                submissionCount: submissions.length,
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
