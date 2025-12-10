import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    throw new Error("Missing Gmail credentials");
  }

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
  });
};
