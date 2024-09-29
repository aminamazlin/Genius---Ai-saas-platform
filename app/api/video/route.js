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
    "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
    {
      input: {
        fps: 24,
        model: "xl",
        width: 1024,
        height: 576,
        prompt: prompt,
        batch_size: 1,
        num_frames: 24,
        init_weight: 0.5,
        guidance_scale: 17.5,
        negative_prompt: "very blue, dust, noisy, washed out, ugly, distorted, broken",
        remove_watermark: false,
        num_inference_steps: 50
      }
    }
    );

    if(!isPro){
      await increaseApiLimit();
    };
    
    console.log(response);
    return NextResponse.json(response, {status: 200})
  } catch(error) {
    console.error("[VIDEO ERROR]", error)
    return new NextResponse("Internal error", {status: 500})
  }
};