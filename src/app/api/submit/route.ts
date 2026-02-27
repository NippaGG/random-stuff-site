import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Item from "@/models/Item";
import Submission from "@/models/Submission";

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
    try {
        await dbConnect();
        const submissionCount = await Submission.countDocuments();
        return NextResponse.json({
            submissionCount,
        });
    } catch (error) {
        console.error("Error fetching submission stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}

// POST /api/submit → create a new submission + notify Discord
export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { toolName, link, category, description } = body;

        if (!toolName || !link || !category || !description) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Check if tool already exists in the curated items (case-insensitive)
        const existingItem = await Item.findOne({
            title: { $regex: new RegExp(`^${toolName.trim()}$`, "i") },
        });

        if (existingItem) {
            return NextResponse.json(
                { error: "This tool already exists in our directory!" },
                { status: 409 }
            );
        }

        // Check if already submitted (case-insensitive)
        const existingSubmission = await Submission.findOne({
            toolName: { $regex: new RegExp(`^${toolName.trim()}$`, "i") },
        });

        if (existingSubmission) {
            return NextResponse.json(
                { error: "This tool has already been submitted!" },
                { status: 409 }
            );
        }

        // Create the submission in MongoDB
        const submission = await Submission.create({
            toolName: toolName.trim(),
            link: link.trim(),
            category,
            description: description.trim(),
        });

        // Send Discord notification (non-blocking, don't fail the request)
        const discordSuccess = await sendToDiscord({
            toolName: toolName.trim(),
            link: link.trim(),
            category,
            description: description.trim(),
        });

        if (!discordSuccess) {
            console.warn("Discord notification failed, but submission was saved.");
        }

        // Get updated count
        const submissionCount = await Submission.countDocuments();

        return NextResponse.json(
            {
                message: "Submission received!",
                submission,
                submissionCount,
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
