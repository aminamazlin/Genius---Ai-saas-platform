import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server'
import { increaseApiLimit, checkApiLimit } from '@lib/api-limit';
import OpenAI from "openai";
import { checkSubscription } from "@lib/subscription";

const openai = new OpenAI();

export const POST = async(req) => {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = "1", resolution = "1024x1024" } = body;

    if(!userId) {
      return new NextResponse("Unauthorized", {status: 401});
    };

    if(!process.env.OPENAI_API_KEY) {
      return new NextResponse("OpenAI API key is not configured", {status: 500})
    };

    if(!prompt) {
      return new NextResponse("Prompt required", {status: 400});
    };

    if(!resolution) {
      return new NextResponse("Resolution required", {status: 400});
    };

    const parsedAmount = parseInt(amount, 10); // Parse amount to an integer
      if (!parsedAmount) {
        return new NextResponse("Valid amount required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro){
      return new NextResponse("Free trial has expired", {status: 403});
    };
    
    const requests = Array.from({ length: parsedAmount }, () => {
      return openai.images.generate({     //Is asynchronous and returns a resolved promise for each request.
        model: "dall-e-3",
        prompt: prompt,
        n: 1, 
        size: resolution,
      });
    });

    const responses = await Promise.all(requests);

    // Extract URLs from the responses
    const urls = responses.map(response => response.data[0].url); //[0] is required, because even if it's only one element, it's still an array. Elements in arrays can only be accessed with index.
    
    if(!isPro){
      await increaseApiLimit();
    };

    return NextResponse.json(urls, {status: 200})
  } catch (error) {
    console.error("[IMAGE ERROR]")
    return new NextResponse("Internal error:" + error.message, {status: 500});
  };
};