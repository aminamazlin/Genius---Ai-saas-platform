"use client"

import { MessageSquare, Music, VideoIcon } from "lucide-react"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {useForm } from "react-hook-form"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

import Heading from "@components/Heading";
import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@components/ui/form";
import { Input } from "@components/ui/input"
import { Button } from "@components/ui/button";
import Empty from "@components/Empty"
import Loader from "@components/Loader"
import { useProModalStore } from "@hooks/use-pro-modal"



const VideoPage = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useProModalStore();
  const [video, setVideo] = useState();

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
      setVideo(undefined);

      const response = await fetch("/api/video", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if(!response.ok) {
        throw new Error(`HTTP ERROR! status:${response.status}`);
      } 

      const videoUrl = await response.json();
      setVideo(videoUrl[0]); 
    } catch (error) {
      console.error("Error occurred:", error);
      if (error?.message?.includes("403")) {
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
        title="Video Generation"
        description="Turn your prompt into a video."
        Icon={VideoIcon}
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
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
                        placeholder="Clown fish swimming around a coral rif"
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
          {!video && !isLoading && (
            <Empty label="No video generated." />
          )}
            {video && (
              <video controls className="w-full aspect-video mt-8 rounded-lg border bg-black">
                <source src={video}/>
              </video>
            )}
        </div>
      </div>
    </div>
  );
}

export default VideoPage