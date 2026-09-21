import { NextResponse } from "next/server";
import { sendContactNotification, sendAutoReply } from "@/lib/emailService";

const ALLOWED_INQUIRY_TYPES = ["job_opportunity", "collaboration", "freelance", "general"];

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, inquiryType, company, message, website } = body;

        // 1. Anti-Bot Honeypot check (Silently return success to trick spam bots)
        if (typeof website === "string" && website.trim() !== "") {
            return NextResponse.json({ success: true, message: "Message sent." });
        }

        // 2. Server-side Validation
        if (!name || typeof name !== "string" || name.trim().length < 2) {
            return NextResponse.json({ success: false, message: "Name is required (min 2 chars)." }, { status: 400 });
        }

        if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return NextResponse.json({ success: false, message: "A valid email is required." }, { status: 400 });
        }

        if (!inquiryType || !ALLOWED_INQUIRY_TYPES.includes(inquiryType)) {
            return NextResponse.json({ success: false, message: "Please select a valid reason." }, { status: 400 });
        }

        if (!message || typeof message !== "string" || message.trim().length < 5) {
            return NextResponse.json({ success: false, message: "Message must be at least 5 characters." }, { status: 400 });
        }

        // 3. Concurrent Dual Email Dispatch (Both send in parallel)
        const emailResults = await Promise.allSettled([
            sendContactNotification({
                name: name.trim(),
                email: email.trim(),
                inquiryType,
                company: company ? company.trim() : undefined,
                message: message.trim(),
            }),
            sendAutoReply({
                name: name.trim(),
                email: email.trim(),
            }),
        ]);

        // Check if notification email failed
        if (emailResults[0].status === "rejected") {
            console.error("❌ Failed to send contact notification:", emailResults[0].reason);
            return NextResponse.json(
                { success: false, message: "Email delivery service unavailable. Please try again later." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Your message has been sent. I'll get back to you soon.",
        });
    } catch (error: any) {
        console.error("❌ Contact API error:", error?.message || error);
        return NextResponse.json(
            { success: false, message: "An unexpected error occurred. Please try again." },
            { status: 500 }
        );
    }
}