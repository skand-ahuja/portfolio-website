"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBolt, faCheck, faCode, faLayerGroup, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { platformsBuilt } from "@/data/experience";

const SECTION_CONFIG = { label: "Platforms Built", heading: "Systems built for", headingAccent: "real workflows.", subtext: "Internal platforms designed to replace repetitive, fragmented and error-prone processes.", selectorLabel: "System index", selectorHint: "Select a platform to explore the problem, solution, stack and impact." };

const formatIndex = (n: number) => String(n + 1).padStart(2, "0");
const formatCount = (arr: any[]) => String(arr.length).padStart(2, "0");
const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.5, delay } });

function ContentBlock({ icon, label, children }: any) {
    return (
        <div>
            <div className="mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]"><FontAwesomeIcon icon={icon} className="h-2.5 w-2.5" /></span>
                <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">{label}</span>
            </div>
            {children}
        </div>
    );
}

function PlatformSelector({ platform, index, isActive, onClick }: any) {
    return (
        <button type="button" role="tab" aria-selected={isActive} onClick={onClick} className="group relative flex w-full items-start gap-4 overflow-hidden border-b border-[var(--border)] px-0 py-5 text-left transition-all duration-300">
            <motion.span initial={false} animate={{ scaleY: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }} transition={{ duration: 0.25 }} className="absolute bottom-0 left-0 top-0 w-[2px] origin-center bg-[var(--accent)]" />
            <span className={`mt-0.5 pl-4 font-mono text-[10px] font-semibold tracking-widest transition-colors ${isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`}>{formatIndex(index)}</span>
            <div className="min-w-0 flex-1">
                <h3 className={`text-[15px] font-semibold leading-snug tracking-tight transition-colors duration-200 ${isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>{platform.title}</h3>
                <p className={`mt-1.5 line-clamp-2 text-xs leading-relaxed transition-colors duration-200 ${isActive ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)]"}`}>{platform.tagline}</p>
            </div>
            <span className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${isActive ? "translate-x-0 bg-[var(--accent)] text-white" : "-translate-x-1 bg-[color-mix(in_srgb,currentColor_5%,transparent)] text-[var(--text-muted)]"}`}><FontAwesomeIcon icon={faArrowRight} className="h-2.5 w-2.5" /></span>
        </button>
    );
}

function PlatformDetail({ platform, index }: any) {
    return (
        <motion.div key={platform.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="transform-gpu">
            <div className="border-b border-[var(--border)] pb-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">Platform {formatIndex(index)}</span>
                    <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" /> Shipped</span>
                </div>
                <h3 className="max-w-2xl text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl xl:text-4xl">{platform.title}</h3>
                <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-[var(--text-secondary)]">{platform.tagline}</p>
            </div>
            <div className="grid grid-cols-1 gap-8 py-7 md:grid-cols-2 md:gap-10">
                <ContentBlock icon={faTriangleExclamation} label="The Problem"><p className="text-[13.5px] leading-relaxed text-[var(--text-secondary)]">{platform.problem}</p></ContentBlock>
                <ContentBlock icon={faLayerGroup} label="What I Built"><p className="text-[13.5px] leading-relaxed text-[var(--text-secondary)]">{platform.solution}</p></ContentBlock>
            </div>
            <div className="border-t border-[var(--border)] py-6">
                <ContentBlock icon={faCode} label="Stack">
                    <div className="flex flex-wrap gap-2">{platform.techStack.map((tech: string) => <span key={tech} className="rounded-md border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-solid)_50%,transparent)] px-2.5 py-1.5 font-mono text-[10px] text-[var(--text-secondary)]">{tech}</span>)}</div>
                </ContentBlock>
            </div>
            <div className="glass-card relative overflow-hidden p-5 sm:p-6" style={{ borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)", background: "color-mix(in srgb, var(--accent) 4%, var(--surface))" }}>
                <div className="relative z-10 flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-white shadow-md"><FontAwesomeIcon icon={faBolt} className="h-3.5 w-3.5" /></span>
                    <div><p className="mb-1 font-mono text-[9px] font-semibold uppercase tracking-widest text-[var(--accent)]">Impact</p><p className="max-w-2xl text-[14px] font-medium leading-relaxed text-[var(--text-primary)] sm:text-[15px]">{platform.impact}</p></div>
                </div>
            </div>
        </motion.div>
    );
}

export default function PlatformsBuilt() {
    const [activeIndex, setActiveIndex] = useState(0);
    if (!platformsBuilt || platformsBuilt.length === 0) return null;
    const activePlatform = platformsBuilt[activeIndex];

    return (
        <section id="platforms-built" className="relative overflow-hidden px-6 py-20 md:px-12 md:py-24">
            <div className="relative z-10 mx-auto max-w-6xl">
                <motion.div {...fadeUp(0)} className="mb-12 md:mb-14">
                    <div className="mb-4 flex items-center gap-3"><span className="block h-px w-7 bg-[var(--accent)]" /><span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">{SECTION_CONFIG.label}</span></div>
                    <h2 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] lg:text-5xl">{SECTION_CONFIG.heading} <span className="text-[var(--accent)]">{SECTION_CONFIG.headingAccent}</span></h2>
                </motion.div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide lg:hidden">
                    {platformsBuilt.map((p, i) => <button key={p.id} onClick={() => setActiveIndex(i)} className="shrink-0 rounded-full px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider" style={{ background: activeIndex === i ? "var(--text-primary)" : "transparent", color: activeIndex === i ? "var(--page-bg)" : "var(--text-secondary)", border: `1px solid ${activeIndex === i ? "transparent" : "var(--border)"}` }}>{formatIndex(i)} &middot; {p.title}</button>)}
                </div>

                <motion.div {...fadeUp(0.05)} className="grid grid-cols-1 lg:grid-cols-[0.35fr_0.65fr] lg:gap-14 xl:gap-20">
                    <aside className="hidden lg:block">
                        <div className="mb-2 flex items-center justify-between border-b border-[var(--border)] pb-3"><span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">{SECTION_CONFIG.selectorLabel}</span></div>
                        <div>{platformsBuilt.map((platform, index) => <PlatformSelector key={platform.id} platform={platform} index={index} isActive={activeIndex === index} onClick={() => setActiveIndex(index)} />)}</div>
                    </aside>
                    <div className="min-w-0 lg:border-l lg:border-[var(--border)] lg:pl-14">
                        <AnimatePresence mode="wait"><PlatformDetail key={activePlatform.id} platform={activePlatform} index={activeIndex} /></AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}