import nodemailer from "nodemailer";
import VerificationEmail from "@/email/otp-template";
import { ApiResponse } from "@/types/ApiResponse";
import { render } from "@react-email/components";

export async function sendMail({
  email,
  username,
  verificationCode,
}: {
  email: string;
  username: string;
  verificationCode: string;
}): Promise<ApiResponse> {
  try {
    let transport;
    {
      process.env.NODE_ENV === "development"
        ? (transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.MAILTRAP_USER,
              pass: process.env.MAILTRAP_PASS,
            },
          }))
        : (transport = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 2525,
            auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_PASS,
            },
          }));
    }

    // TODO UPDATE VALUES
    const mailOptions = {
      from: `MERI ID HAI <${process.env.MAILTRAP_USER}>`,
      to: email,
      subject: `Verification code - ${verificationCode}`,
      html: render(
        <VerificationEmail
          username={username}
          verificationCode={verificationCode}
        />
      ),
    };

    const mailers = await transport.sendMail(mailOptions);

    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (error) {
    console.log("Error sending verification email: ", error);
    return {
      success: false,
      message: "Error sending verification email. Please try again later.",
    };
  }
}
