import nodemailer from "nodemailer";
import EmailOptions from "./../types/email";

// Använder mailtrap.io för att testa e-post i utveckling
const sendEmail = async (options: EmailOptions): Promise<void> => {
  // 1. Skapa en transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    secure: false,
  });

  // 2. Definiera e-postalternativ
  const mailOpt = {
    from: "William Bostrom <william.bostrom@chasacademy.se>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: för styla mail
  };

  // 3. Skicka e-post
  await transporter.sendMail(mailOpt);
};

export default sendEmail;
