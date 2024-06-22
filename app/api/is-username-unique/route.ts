import { db } from "@/lib/db";
import { usernameValidation } from "@/models/schema/signupSchema";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  await db();
  try {
    const { searchParams } = new URL(req.url);
    const queryParam = { username: searchParams.get("username") };

    const res = UsernameQuerySchema.safeParse(queryParam);

    // console.log(res.data?.username);

    if (!res.success) {
      const usernameError = res.error.format().username?._errors || [];

      // console.log(usernameError);

      return NextResponse.json(
        {
          success: false,
          message:
            usernameError.length > 0
              ? usernameError.join(", ")
              : "Invalid username",
        },
        { status: 400 }
      );
    }

    const username = res.data?.username;

    const existingVerifiedUser = await User.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Username is available.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "An error occured while checking username" },
      { status: 500 }
    );
  }
}
