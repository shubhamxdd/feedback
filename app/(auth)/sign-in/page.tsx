"use client";

import { loginSchema } from "@/models/schema/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const SignIn = () => {
  // const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    // console.log(data);

    // setIsSubmitting(true);

    const res = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    console.log(res);

    if (res?.error) {
      console.log(res.error);
      toast({
        title: "Login Failed",
        description: "Invalid credentials",
        variant: "destructive",
      });
      // setIsSubmitting(false);
    }

    if (res?.url) {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-200">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-lg">
        <div className="text-center">
          <h1 className=" text-4xl font-bold tracking-tight mb-4 lg:text-5xl">
            Sign in
          </h1>
        </div>
        {/* FORM */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="shubhamxd" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="******" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              // disabled={isSubmitting}
            >
              Login
              {/* {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Logging in</span>
                </>
              ) : (
                "Login"
              )} */}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Using first time?{" "}
            <Link
              href={"/sign-up"}
              className="text-blue-500 underline hover:text-blue-700 transition-all duration-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignIn;
