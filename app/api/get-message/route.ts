import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { db } from "@/lib/db";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await db();

  const session = await getServerSession(authOptions);

  const user: User = session?.user;

  if (!session || !user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  // console.log(userId)

  try {
    const existingUser = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$message" },
      { $sort: { "message.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$message" } } },
    ]).exec();

    // console.log(existingUser)

    if (!existingUser || existingUser.length === 0) {
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
        messages: existingUser[0].messages,
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
