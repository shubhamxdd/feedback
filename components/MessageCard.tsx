"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { MessageType } from "@/models/Message";
import { useToast } from "./ui/use-toast";
import axios from "axios";

const MessageCard = ({
  message,
  onMessageDelete,
}: {
  message: MessageType;
  onMessageDelete: (messageId: string) => void;
}) => {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    // TODO
    const res = await axios.delete(`/api/delete-message/${message._id}`);
    // console.log(res)

    toast({
      title: "Message deleted",
      description: "Message was successfully deleted",
      variant: "default",
    });
    onMessageDelete(message._id as string);

    // console.log("Delete confirmed");
  };

  const formattedDate = new Date(message.createdAt).toLocaleDateString(
    "en-US",
    {
      weekday: "long", // "Monday"
      year: "numeric", // "2021"
      month: "long", // "July"
      day: "numeric", // "19"
    }
  );
  const formattedTime = new Date(message.createdAt).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit", // "02"
      minute: "2-digit", // "00"
      // second: "2-digit", // "00"
      hour12: false, // "AM" or "PM"
    }
  );

  // Usage inside CardDescription

  return (
    <Card>
      <CardHeader>
        <AlertDialog>
          <>
            <div className="flex items-center justify-between">
              <CardTitle>{message.message}</CardTitle>
              <AlertDialogTrigger asChild>
                <Button variant={"destructive"}>
                  <X className="w-6 h-6" />
                </Button>
              </AlertDialogTrigger>
            </div>
          </>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleDeleteConfirm();
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <CardDescription>
          <p>{formattedDate}</p>
          <p>{formattedTime}</p>
        </CardDescription>
      </CardHeader>
      {/* <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  );
};

export default MessageCard;
