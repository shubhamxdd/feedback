"use client";

import AiResponse from "@/components/ai-response";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { messageSchema } from "@/models/schema/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const UsernamePage = ({
  params: { username },
}: {
  params: { username: string };
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [doesUserExistInDatabase, setDoesUserExistInDatabase] = useState(true);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post(`/api/send-message`, {
        username,
        content: data.message,
      });
      // console.log(res.data);

      toast({
        title: res.data.message,
        description: "Your message has been sent",
      });
      form.setValue("message", "");
    } catch (error) {
      console.log(error);

      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Error sending message",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // check if username is valid that is user exists in database
  const checkUsername = async () => {
    try {
      const res = await axios.get(`/api/user-exist?username=${username}`);

      // console.log(res.data);

      setDoesUserExistInDatabase(res.data.success);

      // toast({
      //   title: res.data.message,
      //   description: "User Exists ! you can send messages.",
      // });
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      setDoesUserExistInDatabase(
        axiosError.response?.data.message === "User not found" ? false : true
      );
      // toast({
      //   title: "Error checking username",
      //   description: axiosError.response?.data.message,
      //   variant: "destructive",
      // });
    }
  };

  useEffect(() => {
    checkUsername();
  }, [username]);

  return (
    <div className="px-6 md:px-10 lg:px-20">
      <h1 className="text-4xl text-center font-bold mb-5 mt-4">
        Send messages!
      </h1>

      <div className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="message"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <p className="font-normal">
                      Send messages to{" "}
                      <span className="font-semibold">@{username}</span>
                    </p>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="write your message here"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="ml-2">Sending</span>
                </>
              ) : (
                "Send"
              )}
            </Button>
            <p
              className={`${
                doesUserExistInDatabase ? "text-green-600" : "text-red-600"
              } font-semibold`}
            >
              {doesUserExistInDatabase
                ? `Send messages to @${username}`
                : `User @${username} does not exist`}
            </p>
          </form>
        </Form>
      </div>

      {/* suggest messages USING AI */}
      <AiResponse />
    </div>
  );
};

export default UsernamePage;
