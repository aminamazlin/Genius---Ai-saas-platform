import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { increaseApiLimit, checkApiLimit } from '@lib/api-limit';
import Replicate from "replicate";
import { checkSubscription } from "@lib/subscription";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const POST = async(req) => {
  try {
    const { userId } = auth();
    const { prompt } = await req.json();

    if(!userId){
      return new NextResponse("Unauthorized", {status: 401})
    };

    if(!process.env.REPLICATE_API_TOKEN){
      return new NextResponse("REPLICATE API key not configured", {status: 500})
    };

    if(!prompt){
      return new NextResponse("Prompt is required", {status: 400})
    }
    
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro){
      return new NextResponse("Free trial has expired", {status: 403});
    };

    const response = await replicate.run(
    "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
    {
      input: {
        top_k: 250,
        top_p: 0,
        prompt: prompt,
        duration: 8,
        temperature: 1,
        continuation: false,
        model_version: "stereo-large",
        output_format: "mp3",
        continuation_start: 0,
        multi_band_diffusion: false,
        normalization_strategy: "peak",
        classifier_free_guidance: 3
      }
    }
    );

    if(!isPro){
      await increaseApiLimit();
    };

    
    console.log(response);
    return NextResponse.json(response, {status: 200})
  } catch(error) {
    console.error("[MUSIC ERROR]", error)
    return new NextResponse("Internal error", {status: 500})
  }
};