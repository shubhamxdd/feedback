"use client";

import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { verifySchema } from "@/models/schema/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const VerifyUsernamePage = ({ params }: { params: { username: string } }) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const res = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: res.data.success ? "Success" : "Error",
        description: res.data.message,
      });

      router.push("/sign-in");
    } catch (error) {
      console.log("Error in verifying username", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;

      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-200">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-lg">
        <div className="text-center">
          <h1 className=" text-4xl font-bold tracking-tight mb-4 lg:text-5xl">
            Verify Account
          </h1>
          <p className="text-green-600 mb-6">
            The code has been sent to your email.
          </p>
        </div>

        <Form {...form}>
          <div className="flex flex-col justify-center items-center">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      {/* <Input placeholder="123456" {...field} /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Verify
              </Button>
            </form>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default VerifyUsernamePage;
