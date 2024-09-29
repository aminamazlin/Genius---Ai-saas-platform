import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
import { increaseApiLimit, checkApiLimit } from '@lib/api-limit';
import OpenAI from "openai";
import { checkSubscription } from '@lib/subscription';
const openai = new OpenAI();

export const POST = async(req) => {
  try {
    const { userId } = auth();
    const { messages } = await req.json();

    if(!userId) {
      return new NextResponse("Unauthorized", {status: 401})
    };

    if(!process.env.OPENAI_API_KEY){
      return new NextResponse("Open AI key is not configured.", {status: 500})
    };

    if(!messages){
      return new NextResponse("Messages are required.", {status: 400})
    }

    const isPro = await checkSubscription();
    const freeTrial = await checkApiLimit();

    if (!freeTrial && !isPro){
      return new NextResponse("Free trial has expired", {status: 403});
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
        role: "system",
        content: "You are a code generator. Answer only in markdown code snippets and provide explanations in code comments."
      },
      ...messages,
      ],
    });

    if(!isPro){
      await increaseApiLimit();
    };
    
    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.error("[CODE ERROR]")
    return new NextResponse("Internal error:" + error.message, {status: 500})
  };
};