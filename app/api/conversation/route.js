import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { increaseApiLimit, checkApiLimit } from '@lib/api-limit';
import OpenAI from "openai";
import { checkSubscription } from '@lib/subscription';
const openai = new OpenAI();

export const POST = async(req) => {
  try {
    const { userId } = auth();  //Check if user is authenticated.
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", {status: 401});
    }

    if(!process.env.OPENAI_API_KEY){
      return new NextResponse("OpenAI API key is not configured", {status: 500})
    }

    if(!messages) {
      return new NextResponse("Messages are required.", {status:400})
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro){
      return new NextResponse("Free trial has expired", {status: 403});
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages  //or messages,
    });

    if(!isPro){
      await increaseApiLimit();
    };

    return NextResponse.json(response.choices[0].message)
  } catch(error) {
    console.error("[CONVERSATION ERROR]")
    return new NextResponse("Internal error:" + error.message, {status: 500});
  }
}
