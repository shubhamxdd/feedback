import { db } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await db();

  //   const { username } = await req.json();

  const { searchParams } = new URL(req.url);
  const queryParam = { username: searchParams.get("username") };

  try {
    const user = await User.findOne({ username: queryParam.username });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User found",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in checking user", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
