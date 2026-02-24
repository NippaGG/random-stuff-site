import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface SubmissionPayload {
    name: string;
    link: string;
    category: string;
    description: string;
}

const SUBMISSIONS_PATH = path.join(process.cwd(), "data", "submissions.json");

function appendToFile(submission: SubmissionPayload & { timestamp: string }) {
    let existing: (SubmissionPayload & { timestamp: string })[] = [];

    try {
        if (fs.existsSync(SUBMISSIONS_PATH)) {
            const raw = fs.readFileSync(SUBMISSIONS_PATH, "utf-8");
            existing = JSON.parse(raw);
        }
    } catch {
        existing = [];
    }

    existing.push(submission);
    fs.writeFileSync(SUBMISSIONS_PATH, JSON.stringify(existing, null, 2), "utf-8");
}

async function sendToDiscord(submission: SubmissionPayload) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        console.error("DISCORD_WEBHOOK_URL is not set");
        return false;
    }

    const embed = {
        title: "📬 New Tool Submission",
        color: 0xa3e635, // lime green to match site theme
        fields: [
            { name: "Tool Name", value: submission.name, inline: true },
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
            body: JSON.stringify({
                embeds: [embed],
            }),
        });

        return res.ok;
    } catch (error) {
        console.error("Discord webhook error:", error);
        return false;
    }
}

export async function POST(request: Request) {
    try {
        const body: SubmissionPayload = await request.json();

        // Basic validation
        if (!body.name || !body.link || !body.category || !body.description) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        const submission = {
            ...body,
            timestamp: new Date().toISOString(),
        };

        // Send to Discord and save to file in parallel
        const [discordSuccess] = await Promise.all([
            sendToDiscord(body),
            Promise.resolve(appendToFile(submission)),
        ]);

        if (!discordSuccess) {
            console.warn("Discord notification failed, but submission was saved to file.");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Submission error:", error);
        return NextResponse.json(
            { error: "Failed to process submission" },
            { status: 500 }
        );
    }
}
