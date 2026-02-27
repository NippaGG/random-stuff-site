import mongoose, { Schema, Document, Model } from "mongoose";

export interface IItem extends Document {
    id: number;
    title: string;
    description: string;
    link: string;
    category: string;
    tags: string[];
    image?: string;
}

const ItemSchema = new Schema<IItem>(
    {
        id: { type: Number, required: true, unique: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        link: { type: String, required: true },
        category: { type: String, required: true },
        tags: { type: [String], required: true },
        image: { type: String },
    },
    { timestamps: true }
);

const Item: Model<IItem> =
    mongoose.models.Item || mongoose.model<IItem>("Item", ItemSchema);

export default Item;
