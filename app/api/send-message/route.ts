import { db } from "@/lib/db";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";
import { MessageType } from "@/models/Message";

export async function POST(req: Request) {
  await db();
  try {
    const { username, content } = await req.json();

    const user = await UserModel.findOne({ username });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (!user.isAllowingNewMessages) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not allowing new messages",
        },
        { status: 403 }
      );
    }

    const newMessage = {
      message: content,
      createdAt: new Date(),
    } as MessageType;

    user.message.push(newMessage);

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Message sent",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
