"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faArrowRight,
    faCopy,
    faSun,
    faMoon,
    faDownload,
    faBriefcase,
    faCode,
    faEnvelope,
    faUser,
    faTerminal,
    faCheck
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { useTheme } from "next-themes";

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    const commands = useMemo(() => [
        {
            id: "about",
            category: "Navigation",
            title: "About Me",
            sub: "Background, origin story & journey",
            icon: faUser,
            action: () => { document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); onClose(); }
        },
        {
            id: "experience",
            category: "Navigation",
            title: "Experience",
            sub: "Career timeline & past roles",
            icon: faBriefcase,
            action: () => { document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" }); onClose(); }
        },
        {
            id: "platforms",
            category: "Navigation",
            title: "Platforms Built",
            sub: "Enterprise pipelines & automation systems",
            icon: faTerminal,
            action: () => { document.getElementById("platforms-built")?.scrollIntoView({ behavior: "smooth" }); onClose(); }
        },
        {
            id: "projects",
            category: "Navigation",
            title: "Projects",
            sub: "Data science models, BI & full-stack apps",
            icon: faCode,
            action: () => { document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); onClose(); }
        },
        {
            id: "contact",
            category: "Navigation",
            title: "Contact",
            sub: "Send a message or proposal",
            icon: faEnvelope,
            action: () => { document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); onClose(); }
        },
        {
            id: "theme",
            category: "Actions",
            title: resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
            sub: "Toggle visual color theme",
            icon: resolvedTheme === "dark" ? faSun : faMoon,
            action: () => { setTheme(resolvedTheme === "dark" ? "light" : "dark"); onClose(); }
        },
        {
            id: "copy-email",
            category: "Actions",
            title: copied ? "Email Copied!" : "Copy Email to Clipboard",
            sub: "skand.ahuja@example.com", // Replace with your email
            icon: copied ? faCheck : faCopy,
            action: () => {
                navigator.clipboard.writeText("skand.ahuja@example.com");
                setCopied(true);
                setTimeout(() => { setCopied(false); onClose(); }, 800);
            }
        },
        {
            id: "resume",
            category: "Actions",
            title: "Download Resume",
            sub: "Get PDF version of CV",
            icon: faDownload,
            action: () => {
                window.open("/Skand_Ahuja_Resume.pdf", "_blank");
                onClose();
            }
        },
        {
            id: "github",
            category: "Socials",
            title: "GitHub Profile",
            sub: "Explore repositories and commits",
            icon: faGithub,
            action: () => { window.open("https://github.com/skand-ahuja", "_blank"); onClose(); }
        },
        {
            id: "linkedin",
            category: "Socials",
            title: "LinkedIn Profile",
            sub: "Professional network & endorsements",
            icon: faLinkedin,
            action: () => { window.open("https://linkedin.com/in/skand-ahuja", "_blank"); onClose(); }
        },
    ], [resolvedTheme, setTheme, copied, onClose]);

    const filtered = useMemo(() => {
        if (!query.trim()) return commands;
        const q = query.toLowerCase();
        return commands.filter(c => c.title.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
    }, [query, commands]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    // Keyboard Navigation inside Palette
    useEffect(() => {
        if (!isOpen) return;

        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex(i => (i + 1) % (filtered.length || 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex(i => (i - 1 + filtered.length) % (filtered.length || 1));
            } else if (e.key === "Enter" && filtered[selectedIndex]) {
                e.preventDefault();
                filtered[selectedIndex].action();
            }
        }

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, filtered, selectedIndex, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[300] flex items-start justify-center p-4 pt-[15vh] sm:p-6 sm:pt-[20vh]"
                    onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
                >
                    {/* Ambient Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Spotlight Palette Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: -16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -16 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-solid)_85%,transparent)] shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
                    >
                        {/* Search Input Bar */}
                        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3.5">
                            <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-[var(--text-muted)]" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Type a command or jump to section..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
                            />
                            <span className="rounded border border-[var(--border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
                                ESC
                            </span>
                        </div>

                        {/* Commands List */}
                        <div className="max-h-[360px] overflow-y-auto p-2 scrollbar-none">
                            {filtered.length === 0 ? (
                                <div className="py-12 text-center text-xs text-[var(--text-muted)]">
                                    No matching command found for &quot;{query}&quot;
                                </div>
                            ) : (
                                filtered.map((cmd, i) => {
                                    const isSelected = i === selectedIndex;
                                    return (
                                        <button
                                            key={cmd.id}
                                            onClick={() => cmd.action()}
                                            onMouseEnter={() => setSelectedIndex(i)}
                                            className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-colors duration-150 ${isSelected
                                                ? "bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]"
                                                : "hover:bg-[color-mix(in_srgb,var(--surface-solid)_40%,transparent)]"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${isSelected ? "bg-[var(--accent)] text-white" : "bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]"
                                                    }`}>
                                                    <FontAwesomeIcon icon={cmd.icon} className="h-3 w-3" />
                                                </span>
                                                <div className="min-w-0">
                                                    <p className={`text-xs font-semibold leading-tight ${isSelected ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                                                        {cmd.title}
                                                    </p>
                                                    <p className="truncate text-[11px] text-[var(--text-muted)] mt-0.5">
                                                        {cmd.sub}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] opacity-60">
                                                {cmd.category}
                                            </span>
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        {/* Bottom Footer Helper */}
                        <div className="flex items-center justify-between border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-solid)_30%,transparent)] px-4 py-2 text-[10px] font-mono text-[var(--text-muted)]">
                            <span>Use ↑↓ to navigate</span>
                            <span>Press ↵ to select</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}