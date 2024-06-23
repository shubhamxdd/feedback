import { db } from "@/lib/db";
import { verifySchema } from "@/models/schema/verifySchema";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await db();

  try {
    const { username, code } = await req.json();

    const decodedUsername = decodeURIComponent(username);

    const res = verifySchema.safeParse({ code });
    // console.log(res);

    if (!res.success) {
      const codeError = res.error.format().code?._errors || [];
      console.log(codeError);
      return NextResponse.json(
        {
          success: false,
          message: codeError.length > 0 ? codeError.join(", ") : "Invalid code",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username: decodedUsername });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const isCodeMatch = user.verifyCode === res.data?.code;

    const isCodeValid = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeMatch && isCodeValid) {
      user.isVerified = true;
      await user.save();

      return NextResponse.json(
        {
          success: true,
          message: "User verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Code has expired",
        },
        { status: 400 }
      );
    } else if (!isCodeMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid code",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
