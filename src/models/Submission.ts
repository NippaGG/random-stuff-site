import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubmission extends Document {
    toolName: string;
    link: string;
    category: string;
    description: string;
    submittedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
    {
        toolName: { type: String, required: true },
        link: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String, required: true },
        submittedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Submission: Model<ISubmission> =
    mongoose.models.Submission ||
    mongoose.model<ISubmission>("Submission", SubmissionSchema);

export default Submission;
