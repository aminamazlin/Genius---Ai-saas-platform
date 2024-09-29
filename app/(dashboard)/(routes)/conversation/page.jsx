"use client"

import { MessageSquare } from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Heading from "@components/Heading";
import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import Empty from "@components/Empty";
import Loader from "@components/Loader";
import { cn } from "@lib/utils";
import UserAvatar from "@components/User-avatar";
import BotAvatar from "@components/Bot-avatar";
import { useProModalStore } from "@hooks/use-pro-modal";
import toast from "react-hot-toast";



const ConversationPage = () => {
  const router = useRouter();
  const {isOpen, onOpen, onClose} = useProModalStore();
  const [messages, setMessages] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),  //Validates the form input against the formSchema before proceeding.
    defaultValues: {
      prompt: ""
    }
  });

  //form is the object returned by useForm. Contains various methods and properties.
  //formState is a property of form object. Contains the current state of the form.
  //isSubmitting is a boolean property within formState. Indicates whether the form is currently submitting.
  const isLoading = form.formState.isSubmitting

  const onSubmit = async(values) => {
    try {
      const userMessage = {
        role: "user",
        content: values.prompt,
      };

      const updatedMessages = [...messages, userMessage]

      const response = await fetch("/api/conversation", {
        method: "POST",
        body: JSON.stringify({
          messages: updatedMessages,
          }),
        headers: {
          "Content-Type": "application/json"
        },
      });

      if(!response.ok) {
        throw new Error(`HTTP ERROR! status:${response.status}`);
      } 
         
      const data = await response.json();
 
      setMessages((prev) => {
        return [...prev, userMessage, data];
      });
      console.log(messages);
      
    } catch (error) {
       console.error("Error occurred:", error);
       if (error?.message.includes("403")) {
         onOpen(); // Open the Pro modal if the error is 403
       } else {
        toast.error("Something went wrong");
       }
    } finally {
      form.reset();
      router.refresh();
    };
  };
  
  return (
    <div>
      <Heading
        title="Conversation"
        description="Our most advanced conversation model."
        Icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              //Explicitly hooks up form submissions to the onSubmit handler.
              //OnSubmit callback is where you define what happens when the form data is validated.

              className="rouned-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt" //specifies the form field to be tracked.
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="How do I calculate the radius of a circle?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full font-bold"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation started." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div
                key={message.content}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm">
                  {message.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConversationPage