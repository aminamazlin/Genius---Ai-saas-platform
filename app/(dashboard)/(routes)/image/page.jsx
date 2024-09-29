"use client";

import { Download, ImageIcon } from "lucide-react";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Heading from "@components/Heading";
import { Form, FormControl, FormField, FormItem } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Card, CardFooter } from "@components/ui/card"
import Empty from "@components/Empty";
import Loader from "@components/Loader";
import Image from "next/image";
import { cn } from "@lib/utils";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@components/ui/select";
import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { useProModalStore } from "@hooks/use-pro-modal";
import toast from "react-hot-toast";


const ImagePage = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useProModalStore();
  const [images, setImages] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema), //Validates the form input against the formSchema before proceeding.
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "1024x1024"
    },
  });

  //form is the object returned by useForm. Contains various methods and properties.
  //formState is a property of form object. Contains the current state of the form.
  //isSubmitting is a boolean property within formState. Indicates whether the form is currently submitting.
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values) => {
    try {
      setImages([]);

      const response = await fetch("/api/image", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ERROR! status:${response.status}`);
      }

      const urls = await response.json();
      setImages(urls);
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
    }
  };

  return (
    <div>
      <Heading
        title="Image Generation"
        description="Turn your prompt into an image."
        Icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form} asChild>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              //Explicitly hooks up form submissions to the onSubmit handler.
              //OnSubmit callback is where you define what happens when the form data is validated.

              className="rouned-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt" //specifies the form field to be tracked.
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input //Automatically connects to form state, because it's a native html element.
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="A picture of a horse in Swiss alps."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control} //Handles the connection between the formstate and the formfield.
                name="amount"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select //Needs explicit control, because it doesn't behave like a native html element.
                      disabled={isLoading}
                      onValueChange={field.onChange} //Updates the form state with the new value.
                      value={field.value} //The current value stored in the form state.
                      defaultValue={field.value} //The initial value when the page is first rendered.
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an amount"/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control} //Handles the connection between the formstate and the formfield.
                name="resolution"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select //Needs explicit control, because it doesn't behave like a native html element.
                      disabled={isLoading}
                      onValueChange={field.onChange} //Updates the form state with the new value.
                      value={field.value} //The current value stored in the form state.
                      defaultValue={field.value} //The initial value when the page is first rendered.
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a resolution"/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
            <div className="p-20">
              <Loader />
            </div>
          )}
          {images.length === 0 && !isLoading && (
            <Empty label="No images generated." />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {images.map((src) => (
              <Card key={src} className="rounded-lg overflow-hidden">
                <div className="relative aspect-square">
                  <Image 
                    alt="Image"
                    fill  //Images fills parent element.
                    src={src} 
                  />
                </div>
                <CardFooter className="p-2">
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => window.open(src)}
                  
                  >
                    <Download className="h-4 w-4 mr-2"/>
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
