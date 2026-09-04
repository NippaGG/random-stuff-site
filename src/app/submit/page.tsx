"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import GridBackground from "@/components/GridBackground";
import CustomCursor from "@/components/CustomCursor";
import Link from "next/link";
import { ArrowLeft, MessageSquare, ShieldCheck } from "lucide-react";

const TOOL_NAME_MAX_LENGTH = 80;
const LINK_MAX_LENGTH = 500;
const DESCRIPTION_MAX_LENGTH = 500;

export default function SubmitPage() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const nameRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLSelectElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        setErrorMessage("");

        const body = {
            toolName: nameRef.current?.value ?? "",
            link: linkRef.current?.value ?? "",
            category: categoryRef.current?.value ?? "",
            description: descriptionRef.current?.value ?? "",
        };

        try {
            const res = await fetch("/api/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus("error");
                setErrorMessage(data.error || "Something went wrong.");
                return;
            }

            setStatus("success");
        } catch {
            setStatus("error");
            setErrorMessage("Network error. Please try again.");
        }
    };

    const resetForm = () => {
        setStatus("idle");
        setErrorMessage("");
        if (nameRef.current) nameRef.current.value = "";
        if (linkRef.current) linkRef.current.value = "";
        if (categoryRef.current) categoryRef.current.value = "";
        if (descriptionRef.current) descriptionRef.current.value = "";
    };

    return (
        <main className="relative min-h-screen text-white flex flex-col items-center justify-center p-6 bg-black overflow-hidden">
            <CustomCursor />

            <div className="fixed inset-0 z-0">
                <GridBackground />
            </div>

            <div className="absolute top-8 left-0 right-0 z-10 w-full max-w-7xl mx-auto flex items-start justify-start pl-4 md:pl-8">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group p-2"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-sm">Back to Home</span>
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md p-8 sm:p-10 rounded-none border border-white/10 bg-black/60 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden z-10 mt-12"
            >
                <div className="absolute inset-x-0 -top-px h-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-[#a3e635] to-transparent opacity-50" />

                <h1 className="text-3xl font-bold mb-2 text-center tracking-tight">Submit a Tool</h1>
                <p className="text-gray-400 text-sm text-center mb-5">
                    Submit a website, software, or script to the directory.
                </p>

                {/* Submission status indicator */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    className="flex items-center justify-center gap-5 mb-8 py-3 px-4 border border-white/5 bg-white/[0.02] rounded-none"
                >
                    <div className="flex items-center gap-2">
                        <MessageSquare size={14} className="text-[#a3e635]/70" />
                        <span className="font-mono text-xs text-gray-400">
                            Discord review queue
                        </span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-[#a3e635]/70" />
                        <span className="font-mono text-xs text-gray-400">
                            Spam protected
                        </span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a3e635] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a3e635]" />
                        </span>
                        <span className="font-mono text-xs text-gray-500">live</span>
                    </div>
                </motion.div>

                {status === "success" ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-4 py-8"
                    >
                        <div className="w-16 h-16 rounded-none bg-[#a3e635]/20 flex items-center justify-center text-[#a3e635] shadow-[0_0_20px_rgba(163,230,53,0.2)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <p className="text-xl font-medium text-[#a3e635] mt-2">Submission Received!</p>
                        <p className="text-gray-400 text-sm text-center max-w-xs">
                            Thanks for sharing. We will review it shortly before adding it to the list.
                        </p>
                        <button
                            onClick={resetForm}
                            className="mt-6 px-6 py-2 rounded-none bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-mono"
                        >
                            Submit another
                        </button>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {status === "error" && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                aria-live="polite"
                                className="py-2.5 px-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-mono rounded-none"
                            >
                                {errorMessage}
                            </motion.div>
                        )}

                        <div className="space-y-1.5">
                            <label htmlFor="name" className="text-sm font-medium text-gray-300 ml-1">Tool Name</label>
                            <input
                                ref={nameRef}
                                id="name"
                                type="text"
                                name="toolName"
                                autoComplete="off"
                                required
                                maxLength={TOOL_NAME_MAX_LENGTH}
                                placeholder="e.g. Raycast"
                                className="w-full px-4 py-2.5 rounded-none bg-white/5 border border-white/10 focus:border-[#a3e635]/50 focus:ring-1 focus:ring-[#a3e635]/50 outline-none transition-all placeholder:text-gray-600 focus:bg-white/10 font-mono text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="link" className="text-sm font-medium text-gray-300 ml-1">Website / GitHub URL</label>
                            <input
                                ref={linkRef}
                                id="link"
                                type="url"
                                name="link"
                                autoComplete="url"
                                spellCheck={false}
                                required
                                maxLength={LINK_MAX_LENGTH}
                                placeholder="https://example.com..."
                                className="w-full px-4 py-2.5 rounded-none bg-white/5 border border-white/10 focus:border-[#a3e635]/50 focus:ring-1 focus:ring-[#a3e635]/50 outline-none transition-all placeholder:text-gray-600 focus:bg-white/10 font-mono text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="category" className="text-sm font-medium text-gray-300 ml-1">Category</label>
                            <div className="relative">
                                <select
                                    ref={categoryRef}
                                    id="category"
                                    name="category"
                                    required
                                    defaultValue=""
                                    className="w-full px-4 py-2.5 rounded-none bg-white/5 border border-white/10 focus:border-[#a3e635]/50 focus:ring-1 focus:ring-[#a3e635]/50 outline-none transition-all text-white appearance-none cursor-pointer focus:bg-white/10 font-mono text-sm"
                                >
                                    <option value="" disabled className="bg-neutral-900">Select a category...</option>
                                    <option value="Websites" className="bg-neutral-900">Websites</option>
                                    <option value="Softwares" className="bg-neutral-900">Softwares</option>
                                    <option value="Scripts" className="bg-neutral-900">Scripts</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="description" className="text-sm font-medium text-gray-300 ml-1">Short Description</label>
                            <textarea
                                ref={descriptionRef}
                                id="description"
                                name="description"
                                autoComplete="off"
                                required
                                rows={3}
                                maxLength={DESCRIPTION_MAX_LENGTH}
                                placeholder="What does it do and why is it useful?"
                                className="w-full px-4 py-3 rounded-none bg-white/5 border border-white/10 focus:border-[#a3e635]/50 focus:ring-1 focus:ring-[#a3e635]/50 outline-none transition-all placeholder:text-gray-600 resize-none focus:bg-white/10 font-mono text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === "submitting"}
                            className="mt-6 w-full py-3 rounded-none bg-white text-black font-semibold tracking-wide hover:bg-gray-200 focus:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                        >
                            {status === "submitting" ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                                />
                            ) : (
                                <>
                                    <span>Submit to Directory</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                )}
            </motion.div>
        </main>
    );
}
