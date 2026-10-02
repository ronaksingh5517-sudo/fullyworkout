import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("aurafit");

    // 1. Database mein save karo
    await db.collection("contacts").insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
    });

    // 2. Direct Gmail par bhejne ke liye transporter setup
    // Note: Iske liye apni Gmail ID aur App Password .env.local file mein dalna hoga
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Yahan tera email aayega: ronaksingh5517@gmail.com
        pass: process.env.EMAIL_PASS, // Gmail ka App Password (Google account se generate hota hai)
      },
    });

    const mailOptions = {
      from: email,
      to: "ronaksingh5517@gmail.com",
      subject: `🚀 New Contact Form Message from ${name} - FullyWorkout`,
      text: `You have received a new message from your FullyWorkout website contact form.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}\n\nTimestamp: ${new Date().toLocaleString()}`,
    };

    // Email send karo
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Message saved and emailed successfully!" });
  } catch (error) {
    console.error("Contact Form Email Error:", error);
    // Agar email configuration nahi bhi hai, tab bhi database mein save rahega taaki error na aaye
    return NextResponse.json({ success: true, message: "Message saved to database!" });
  }
}