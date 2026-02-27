"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, User, Bot, ChevronDown, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage as ChatMessageType } from "./types";
import { ConfidenceBadge } from "./ConfidenceBadge";

interface ChatMessageProps {
    message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user";
    const [evidenceOpen, setEvidenceOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
        >
            {/* Avatar */}
            <div
                className={`flex-shrink-0 w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center ${isUser ? "bg-yellow-200" : "bg-blue-200"
                    }`}
            >
                {isUser ? <User size={14} /> : <Bot size={14} />}
            </div>

            {/* Message bubble */}
            <div className={`max-w-[80%] ${isUser ? "text-right" : ""}`}>
                <div
                    className={`inline-block rounded-lg border-2 p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.08)] ${isUser
                        ? "border-slate-300 bg-yellow-50 text-slate-800"
                        : "border-slate-300 bg-white text-slate-800"
                        }`}
                    style={{ filter: "url(#squiggle)" }}
                >
                    {/* Not Found response */}
                    {message.notFound && (
                        <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-1">
                            <span>🚫</span> Not found in your notes
                        </div>
                    )}

                    {/* Answer text — rendered as Markdown for AI, plain for user */}
                    {isUser ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    ) : (
                        <div className="prose prose-sm prose-slate max-w-none text-sm leading-relaxed
                            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-headings:mt-3 prose-headings:mb-1.5
                            prose-h1:text-base prose-h2:text-[0.9rem] prose-h3:text-[0.85rem]
                            prose-p:my-1.5 prose-p:leading-relaxed
                            prose-ul:my-1.5 prose-ul:pl-4 prose-ol:my-1.5 prose-ol:pl-4
                            prose-li:my-0.5 prose-li:leading-relaxed
                            prose-strong:text-slate-900
                            prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:border prose-code:border-blue-200
                            prose-pre:bg-slate-50 prose-pre:border prose-pre:border-slate-200 prose-pre:rounded-md prose-pre:text-xs
                            prose-blockquote:border-l-2 prose-blockquote:border-yellow-400 prose-blockquote:bg-yellow-50 prose-blockquote:py-1 prose-blockquote:px-3 prose-blockquote:text-slate-700 prose-blockquote:not-italic
                            prose-a:text-blue-600 prose-a:underline prose-a:underline-offset-2
                        ">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                    )}

                    {/* Confidence badge */}
                    {message.confidence && (
                        <div className="mt-3">
                            <ConfidenceBadge level={message.confidence} />
                        </div>
                    )}

                    {/* Citations */}
                    {message.citations && message.citations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5">📎 Sources</div>
                            <div className="flex flex-wrap gap-1.5">
                                {message.citations.map((c, i) => (
                                    <span
                                        key={i}
                                        className="inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-mono text-blue-700"
                                    >
                                        <FileText size={10} />
                                        {c.fileName} {c.page !== null && `p.${c.page}`}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Evidence snippets — collapsible */}
                    {message.evidence && message.evidence.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                            <button
                                onClick={() => setEvidenceOpen(!evidenceOpen)}
                                className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-slate-400 font-bold hover:text-slate-600 transition-colors w-full text-left cursor-pointer"
                            >
                                {evidenceOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                📝 Evidence ({message.evidence.length} snippets)
                            </button>
                            <AnimatePresence>
                                {evidenceOpen && (
                                    <motion.ul
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-1 mt-1.5 overflow-hidden"
                                    >
                                        {message.evidence.map((e, i) => (
                                            <li key={i} className="text-xs text-slate-600 bg-slate-50 rounded px-2 py-1 border-l-2 border-slate-300 italic">
                                                &ldquo;{e}&rdquo;
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Timestamp */}
                <div className={`text-[10px] text-slate-400 mt-1 ${isUser ? "text-right" : ""}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
            </div>
        </motion.div>
    );
}
