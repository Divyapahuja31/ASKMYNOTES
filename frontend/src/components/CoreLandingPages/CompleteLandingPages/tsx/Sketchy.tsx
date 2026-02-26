"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Circle, Layout, PenTool, Ruler, Scissors, Shapes, BookOpen, Brain, Search, FileText, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/src/lib/utils"

// --- 1. The Magic SVG Filter (Squiggly Lines) ---
export function SquiggleFilter() {
    return (
        <svg className="hidden">
            <defs>
                <filter id="squiggle">
                    <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="5" result="noise" seed="0" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
                </filter>
                {/* A second, rougher filter for "filling" */}
                <filter id="pencil-texture">
                    <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
            </defs>
        </svg>
    );
}

// --- 2. Hand-Drawn Components ---

export function SketchButton({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95, rotate: 1 }}
            className={cn(
                "relative px-8 py-3 font-bold text-slate-800 transition-colors group",
                className
            )}
        >
            {/* The Button Border (SVG for perfect stroke control) */}
            <div className="absolute inset-0 h-full w-full" style={{ filter: "url(#squiggle)" }}>
                <svg className="h-full w-full overflow-visible">
                    <rect x="2" y="2" width="100%" height="100%" rx="8" fill="transparent" stroke="currentColor" strokeWidth="3" className="text-slate-800" />
                </svg>
            </div>

            {/* Background Fill (Offset) */}
            <div className="absolute inset-0 top-1 left-1 -z-10 h-full w-full rounded-lg bg-yellow-300 opacity-0 transition-opacity group-hover:opacity-100" style={{ filter: "url(#squiggle)" }} />

            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </motion.button>
    );
};

export function StickyNote({ children, color = "bg-yellow-200", rotate = 0, className }: any) {
    return (
        <motion.div
            whileHover={{ scale: 1.1, rotate: rotate * -1, zIndex: 10 }}
            className={cn(
                "relative flex h-64 w-64 flex-col justify-between p-6 shadow-sm",
                color,
                className
            )}
            style={{
                filter: "url(#squiggle)",
                transform: `rotate(${rotate}deg)`
            }}
        >
            {/* Tape Effect */}
            <div className="absolute -top-3 left-1/2 h-8 w-24 -translate-x-1/2 bg-white/40 shadow-sm rotate-1" />

            <div className="font-handwriting text-slate-800 text-lg leading-relaxed">
                {children}
            </div>

            <div className="self-end opacity-50">
                <Scissors size={16} />
            </div>
        </motion.div>
    )
}

// --- 3. Graph Paper Background ---
export function GraphPaper() {
    return (
        <div className="fixed inset-0 -z-10 bg-[#fdfbf7]">
            {/* Blue Grid Lines */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)", backgroundSize: "40px 40px" }}
            />
            {/* Paper Grain */}
            <div className="absolute inset-0 opacity-30" style={{ filter: "url(#pencil-texture)" }} />
        </div>
    );
}

// --- 4. Hero Section with Live Drawing ---
export function Hero() {
    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center pt-24 pb-12 overflow-hidden px-4">

            {/* The "Highlighter" Stroke behind text */}
            <div className="relative mb-6 text-center">
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "circOut" }}
                    className="absolute bottom-2 left-0 -z-10 h-6 w-full origin-left -rotate-1 rounded-sm bg-blue-300/50"
                    style={{ filter: "url(#squiggle)" }}
                />
                <span className="font-mono text-sm font-bold uppercase tracking-widest text-blue-600">
                    Subject-Scoped Study Copilot
                </span>
            </div>

            <h1 className="relative text-center text-6xl font-black tracking-tight text-slate-900 md:text-8xl">
                Ask <span className="relative inline-block">
                    Your Notes
                    {/* Hand Drawn Circle */}
                    <svg className="absolute -left-4 -top-6 h-[140%] w-[120%] overflow-visible text-red-500 pointer-events-none" style={{ filter: "url(#squiggle)" }}>
                        <motion.path
                            d="M 10 30 Q 50 10 90 30 T 170 30"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 1 }}
                        />
                        <motion.path
                            d="M 10 50 Q 60 70 170 50"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 1.2 }}
                        />
                    </svg>
                </span> <br />
                Get Answers.
            </h1>

            <p className="mt-8 max-w-lg text-center font-medium text-slate-500 text-lg leading-relaxed">
                Upload notes for <strong className="text-slate-700">3 subjects</strong>, ask questions in a chat, and get <strong className="text-slate-700">grounded answers with citations</strong> — straight from your study material. No guessing, no hallucinations.
            </p>

            <div className="mt-12 flex gap-6">
                <SketchButton>
                    Get Started <ArrowRight size={18} />
                </SketchButton>
                <button className="px-6 py-3 font-mono text-sm font-bold text-slate-500 underline decoration-wavy underline-offset-4 hover:text-slate-900">
                    How It Works
                </button>
            </div>

            {/* Live Drawing Animation Box - Study Interface Preview */}
            <div className="mt-20 w-full max-w-4xl">
                <div className="relative aspect-video w-full rounded-xl border-2 border-slate-900 bg-white p-4 shadow-xl" style={{ filter: "url(#squiggle)" }}>
                    {/* Browser Header */}
                    <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-4 mb-8">
                        <div className="h-3 w-3 rounded-full border border-slate-900 bg-red-400" />
                        <div className="h-3 w-3 rounded-full border border-slate-900 bg-yellow-400" />
                        <div className="h-3 w-3 rounded-full border border-slate-900 bg-green-400" />
                        <span className="ml-4 font-mono text-xs text-slate-400">AskMyNotes — Chat</span>
                    </div>

                    {/* Content: Study App Layout Drawing Itself */}
                    <div className="grid grid-cols-12 gap-4 h-64">
                        {/* Sidebar - Subject list */}
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "100%" }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="col-span-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-2 overflow-hidden"
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5 }}
                                className="space-y-2"
                            >
                                <div className="h-6 rounded bg-blue-100 border border-blue-200 flex items-center px-2">
                                    <span className="text-[10px] font-mono text-blue-600 truncate">📘 Physics</span>
                                </div>
                                <div className="h-6 rounded bg-green-100 border border-green-200 flex items-center px-2">
                                    <span className="text-[10px] font-mono text-green-600 truncate">📗 Chemistry</span>
                                </div>
                                <div className="h-6 rounded bg-purple-100 border border-purple-200 flex items-center px-2">
                                    <span className="text-[10px] font-mono text-purple-600 truncate">📕 Math</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Main Content - Chat area */}
                        <div className="col-span-9 flex flex-col gap-4">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 0.8, delay: 1 }}
                                className="h-32 w-full rounded-lg border-2 border-slate-900 bg-blue-50 p-3 overflow-hidden"
                            >
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 2 }}
                                    className="space-y-2"
                                >
                                    <div className="flex gap-2 items-start">
                                        <div className="h-4 w-4 rounded-full bg-slate-300 flex-shrink-0 mt-0.5" />
                                        <div className="bg-white rounded px-2 py-1 border border-slate-200">
                                            <span className="text-[9px] text-slate-600">What is Newton&apos;s 2nd law?</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 items-start justify-end">
                                        <div className="bg-blue-100 rounded px-2 py-1 border border-blue-200">
                                            <span className="text-[9px] text-blue-700">F = ma [📎 Ch.3, p.42]</span>
                                        </div>
                                        <div className="h-4 w-4 rounded-full bg-blue-400 flex-shrink-0 mt-0.5" />
                                    </div>
                                </motion.div>
                            </motion.div>
                            <div className="flex gap-4 h-full">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: 1.8 }}
                                    className="h-full w-1/2 rounded-lg border-2 border-slate-900 bg-yellow-50 p-2 overflow-hidden"
                                >
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
                                        <span className="text-[9px] font-bold text-slate-700 block mb-1">📊 Confidence</span>
                                        <div className="h-3 w-3/4 bg-green-300 rounded-full" />
                                        <span className="text-[8px] text-green-700 mt-1 block">High</span>
                                    </motion.div>
                                </motion.div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: 2.0 }}
                                    className="h-full w-1/2 rounded-lg border-2 border-slate-900 bg-pink-50 p-2 overflow-hidden"
                                >
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}>
                                        <span className="text-[9px] font-bold text-slate-700 block mb-1">📎 Evidence</span>
                                        <span className="text-[8px] text-slate-500 block">notes_ch3.pdf</span>
                                        <span className="text-[8px] text-slate-500 block">pg 42, sec 3.2</span>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Cursor */}
                    <motion.div
                        initial={{ x: 0, y: 0, opacity: 0 }}
                        animate={{
                            x: [0, 200, 400, 300],
                            y: [0, 100, 50, 200],
                            opacity: 1
                        }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute top-0 left-0 pointer-events-none"
                    >
                        <PenTool className="h-8 w-8 text-slate-900 -rotate-12 drop-shadow-lg" fill="white" />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

// --- 5. Features (Sticky Notes) ---
export function FeatureBoard() {
    return (
        <section className="py-32 px-4 overflow-hidden">
            <div className="mx-auto max-w-6xl">
                <div className="mb-20 flex items-end justify-between border-b-2 border-slate-900 pb-4">
                    <h2 className="text-4xl font-black text-slate-900">
                        The <span className="text-blue-600 decoration-wavy underline">Feature</span> Board.
                    </h2>
                    <Ruler className="text-slate-400" />
                </div>

                <div className="flex flex-wrap justify-center gap-12">
                    <StickyNote rotate={-3} color="bg-yellow-200">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-800 bg-white">
                            <BookOpen size={20} />
                        </div>
                        <h3 className="font-bold text-xl mb-2">3-Subject Setup</h3>
                        <p className="text-sm">Create 3 subjects & upload PDF/TXT notes for each. Multiple files per subject supported.</p>
                    </StickyNote>

                    <StickyNote rotate={2} color="bg-blue-200">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-800 bg-white">
                            <Search size={20} />
                        </div>
                        <h3 className="font-bold text-xl mb-2">Scoped Q&A</h3>
                        <p className="text-sm">Pick a subject, ask questions, get answers strictly from your notes with citations & evidence.</p>
                    </StickyNote>

                    <StickyNote rotate={-1} color="bg-pink-200">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-800 bg-white">
                            <Brain size={20} />
                        </div>
                        <h3 className="font-bold text-xl mb-2">Study Mode</h3>
                        <p className="text-sm">Auto-generate 5 MCQs + 3 short-answer questions with model answers, all cited from your notes.</p>
                    </StickyNote>
                </div>
            </div>
        </section>
    )
}

// --- 6. Marquee (Handwritten Tape) ---
export function TapeMarquee() {
    return (
        <div className="relative -rotate-2 bg-slate-900 py-6 overflow-hidden shadow-xl" style={{ filter: "url(#squiggle)" }}>
            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                className="flex whitespace-nowrap"
            >
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center gap-8 mx-8">
                        <span className="text-3xl font-black text-[#fdfbf7] uppercase tracking-widest">
                            Upload • Ask • Learn • Cite
                        </span>
                        <Circle className="h-4 w-4 fill-blue-500 text-blue-500" />
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

// --- 7. Floating Doodles (Animated background decorations) ---
export function FloatingDoodles() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Star doodle */}
            <motion.svg
                className="absolute top-20 right-[15%] w-12 h-12 text-amber-400 opacity-50"
                viewBox="0 0 40 40"
                animate={{ rotate: [0, 15, -15, 0], y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <path
                    d="M20 2 L24 14 L38 14 L27 22 L31 36 L20 28 L9 36 L13 22 L2 14 L16 14 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
            </motion.svg>

            {/* Circle doodle */}
            <motion.svg
                className="absolute top-40 left-[10%] w-16 h-16 text-blue-400 opacity-30"
                viewBox="0 0 50 50"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 3" />
            </motion.svg>

            {/* Book doodle */}
            <motion.svg
                className="absolute top-[30%] right-[8%] w-14 h-14 text-violet-400 opacity-35"
                viewBox="0 0 50 50"
                animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <path
                    d="M10 40 L10 10 C15 8 20 8 25 12 C30 8 35 8 40 10 L40 40 C35 38 30 38 25 42 C20 38 15 38 10 40Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                <line x1="25" y1="12" x2="25" y2="42" stroke="currentColor" strokeWidth="1.5" />
            </motion.svg>

            {/* Lightbulb doodle */}
            <motion.svg
                className="absolute bottom-[25%] left-[12%] w-10 h-14 text-yellow-500 opacity-35"
                viewBox="0 0 40 55"
                animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                <path
                    d="M20 5 C10 5 5 12 5 20 C5 28 12 32 14 38 L26 38 C28 32 35 28 35 20 C35 12 30 5 20 5Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                <line x1="14" y1="42" x2="26" y2="42" stroke="currentColor" strokeWidth="2" />
                <line x1="15" y1="46" x2="25" y2="46" stroke="currentColor" strokeWidth="2" />
                <line x1="17" y1="50" x2="23" y2="50" stroke="currentColor" strokeWidth="2" />
            </motion.svg>

            {/* Squiggly underline */}
            <motion.svg
                className="absolute top-[55%] left-[5%] w-28 h-6 text-rose-400 opacity-25"
                viewBox="0 0 120 20"
                animate={{ x: [0, 15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
                <path
                    d="M0 10 Q10 0 20 10 Q30 20 40 10 Q50 0 60 10 Q70 20 80 10 Q90 0 100 10 Q110 20 120 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </motion.svg>

            {/* Arrow doodle */}
            <motion.svg
                className="absolute bottom-[35%] right-[18%] w-16 h-16 text-emerald-500 opacity-25"
                viewBox="0 0 60 60"
                animate={{ x: [0, 10, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
                <path
                    d="M10 50 C20 20 40 15 50 10 M42 8 L50 10 L48 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />
            </motion.svg>
        </div>
    );
}

// --- 8. Notebook Feature Card (with pin + notebook lines) ---
function NotebookFeatureCard({
    icon: Icon,
    emoji,
    title,
    description,
    rotation,
    delay,
    pinColor,
}: {
    icon: React.ElementType;
    emoji: string;
    title: string;
    description: string;
    rotation: number;
    delay: number;
    pinColor: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            className="relative group"
            initial={{ opacity: 0, y: 60, rotate: rotation * 2 }}
            animate={isInView ? { opacity: 1, y: 0, rotate: rotation } : {}}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
        >
            {/* Pin */}
            <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-6 h-6 rounded-full shadow-md border-2 border-white"
                style={{ backgroundColor: pinColor }}
            />

            {/* Card */}
            <motion.div
                className="relative bg-white border-2 border-slate-200 rounded-sm p-6 pt-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.08)] transition-all cursor-default overflow-hidden"
                whileHover={{
                    rotate: 0,
                    scale: 1.05,
                    zIndex: 10,
                }}
                style={{ filter: "url(#squiggle)" }}
            >
                {/* Notebook ruling lines */}
                <div className="absolute inset-x-4 top-8 bottom-4 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="border-b border-blue-100/60" style={{ height: "28px" }} />
                    ))}
                </div>

                {/* Red margin line */}
                <div className="absolute top-0 bottom-0 left-10 w-px bg-rose-200/60" />

                <div className="relative z-10">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-800 bg-white">
                        <Icon size={20} />
                    </div>
                    <h3 className="font-black text-lg text-slate-800 mb-2 tracking-tight">{title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-light">{description}</p>
                </div>

                {/* Corner fold */}
                <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[16px] border-t-[16px] border-l-transparent border-t-slate-100/80" />
            </motion.div>
        </motion.div>
    );
}

// --- 9. Notebook Feature Grid (6 detailed features) ---
export function NotebookFeatureGrid() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const features = [
        {
            icon: BookOpen,
            emoji: "📂",
            title: "Three-Subject Setup",
            description: "Create exactly 3 subjects and upload multiple PDF or TXT notes for each. Your study material, perfectly organized.",
            rotation: -2,
            pinColor: "#ef4444",
        },
        {
            icon: Search,
            emoji: "💬",
            title: "Subject-Scoped Q&A",
            description: "Select a subject and ask questions in a chat interface. Answers come strictly from your uploaded notes — nothing else.",
            rotation: 1.5,
            pinColor: "#3b82f6",
        },
        {
            icon: FileText,
            emoji: "📎",
            title: "Citations & Evidence",
            description: "Every answer includes file name references, page/section citations, confidence level, and top supporting evidence snippets.",
            rotation: -1,
            pinColor: "#10b981",
        },
        {
            icon: ShieldCheck,
            emoji: "🚫",
            title: '"Not Found" Handling',
            description: 'No guessing. No fabrication. If the answer isn\'t in your notes, you get a clear "Not found in your notes" response.',
            rotation: 2,
            pinColor: "#f59e0b",
        },
        {
            icon: Brain,
            emoji: "🧠",
            title: "Study Mode",
            description: "Generate 5 MCQs with explanations and 3 short-answer questions with model answers — all with citations from your notes.",
            rotation: -1.5,
            pinColor: "#8b5cf6",
        },
        {
            icon: Zap,
            emoji: "⚡",
            title: "Instant & Accurate",
            description: "Powered by AI with strict grounding. Get transparent, trustworthy answers with confidence levels: High, Medium, or Low.",
            rotation: 1,
            pinColor: "#ec4899",
        },
    ];

    return (
        <section ref={ref} className="relative z-10 py-24 px-4 md:px-12 lg:px-20">
            <FloatingDoodles />

            {/* Section heading */}
            <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
            >
                <motion.span
                    className="inline-block text-xs font-mono uppercase tracking-[0.3em] text-slate-400 mb-4"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.2 }}
                >
                    ── All Features ──
                </motion.span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
                    Everything You Need to{" "}
                    <span className="relative inline-block">
                        Study Smarter
                        <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" preserveAspectRatio="none">
                            <motion.path
                                d="M0 6 C40 0 60 12 100 6 C140 0 160 12 200 6"
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="3"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={isInView ? { pathLength: 1 } : {}}
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                        </svg>
                    </span>
                </h2>
            </motion.div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {features.map((feature, i) => (
                    <NotebookFeatureCard
                        key={i}
                        icon={feature.icon}
                        emoji={feature.emoji}
                        title={feature.title}
                        description={feature.description}
                        rotation={feature.rotation}
                        delay={0.1 + i * 0.1}
                        pinColor={feature.pinColor}
                    />
                ))}
            </div>
        </section>
    );
}

// --- 10. How It Works (Timeline) ---
export function HowItWorks() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const steps = [
        {
            step: "01",
            title: "Create Your Subjects",
            desc: "Set up exactly three subjects you want to study. Name them however you like.",
            emoji: "📁",
        },
        {
            step: "02",
            title: "Upload Your Notes",
            desc: "Drag & drop PDFs or TXT files for each subject. Upload as many files as you need.",
            emoji: "📤",
        },
        {
            step: "03",
            title: "Ask & Learn",
            desc: "Select a subject, ask questions in chat, and get cited answers. Or switch to Study Mode for quizzes!",
            emoji: "🎓",
        },
    ];

    return (
        <section ref={ref} className="relative z-10 py-24 px-4">
            <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
            >
                <h3 className="text-center text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-16">
                    How It Works
                    <span className="text-amber-400 ml-1">*</span>
                </h3>

                <div className="relative">
                    {/* Connecting dashed line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-slate-300 hidden md:block" />

                    {steps.map((item, i) => (
                        <motion.div
                            key={i}
                            className={`relative flex items-center gap-8 mb-12 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.5 + i * 0.25, duration: 0.6 }}
                        >
                            {/* Step circle on the dashed line */}
                            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-slate-900 font-black text-sm z-10">
                                {item.step}
                            </div>

                            {/* Content card */}
                            <div className={`flex-1 ${i % 2 === 0 ? "md:pr-20 md:text-right" : "md:pl-20"}`}>
                                <motion.div
                                    className="inline-block bg-white border-2 border-slate-200 rounded-sm p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.08)]"
                                    whileHover={{ scale: 1.03, rotate: i % 2 === 0 ? -1 : 1 }}
                                    style={{ filter: "url(#squiggle)" }}
                                >
                                    <span className="text-2xl block mb-2">{item.emoji}</span>
                                    <span className="md:hidden text-xs font-mono text-slate-400 block mb-1">Step {item.step}</span>
                                    <h4 className="font-black text-lg text-slate-800 mb-1">{item.title}</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                                </motion.div>
                            </div>

                            {/* Spacer for the other side */}
                            <div className="hidden md:block flex-1" />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}

// --- 11. Bottom CTA ---
export function BottomCTA() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <section ref={ref} className="relative z-10 py-24 px-4">
            <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
            >
                <div className="inline-block relative">
                    <div className="absolute -inset-3 border-2 border-dashed border-slate-300 rounded-lg -rotate-1" />
                    <div className="relative bg-white border-2 border-slate-900 rounded-lg p-8 md:p-12" style={{ filter: "url(#squiggle)" }}>
                        <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 mb-3">
                            Ready to ace your exams? 🎯
                        </h3>
                        <p className="text-slate-500 mb-6 max-w-md mx-auto">
                            Stop drowning in notes. Let AskMyNotes find the answers for you — with proof.
                        </p>
                        <SketchButton className="mx-auto">
                            Start Studying Smarter <ArrowRight size={18} />
                        </SketchButton>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

