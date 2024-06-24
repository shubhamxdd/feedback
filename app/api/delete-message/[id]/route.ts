import { db } from "@/lib/db";
import { getServerSession, User } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/User";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const messageId = params.id;

  console.log(messageId);
  await db();
  const session = await getServerSession(authOptions);
  const user: User = await session?.user;

  if (!session || !user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    const updated = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updated.modifiedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting message", error);
    return NextResponse.json(
      { success: false, message: "Error deleting message" },
      { status: 500 }
    );
  }
}
