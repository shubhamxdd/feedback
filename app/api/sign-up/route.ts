import { db } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { hash, compare } from "bcryptjs";
import { sendMail } from "@/lib/mailer";

export async function POST(req: Request) {
  await db();
  try {
    const { email, username, password } = await req.json();

    const existingUserByUsername = await User.findOne({
      username,
      isVerified: true,
    });

    if (existingUserByUsername?.username) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists or username is taken.",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await User.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail?.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User already exists or email is taken. Please login",
          },
          { status: 500 }
        );
      } else {
        const hashedPassword = await hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 6);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;

        existingUserByEmail.verifyCodeExpiry = expiryDate;

        await existingUserByEmail.save();

        const mail = await sendMail({
          email,
          username,
          verificationCode: verifyCode,
        });
        console.log(mail);

        if (!mail.success) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Verification email could not be sent. Please try again later.",
            },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            {
              success: true,
              message: "User registered. Please check your email.",
            },
            { status: 200 }
          );
        }
      }
    } else {
      const hashedPassword = await hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 6);

      const user = new User({
        email,
        username,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        message: [],
      });
      await user.save();
    }

    const emailRes = await sendMail({
      email,
      username,
      verificationCode: verifyCode,
    });

    console.log(emailRes);

    if (!emailRes.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification email could not be sent. Please try again later.",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: true,
          message: "User registered. Please check your email.",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Error sending verification email. Please try again later.",
      },
      {
        status: 500,
        statusText: "Error sending verification email. Please try again later.",
      }
    );
  }
}
