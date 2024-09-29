import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import prisma from "@lib/db";
import { stripe } from "@lib/stripe"; //Api key config.

export const POST = async(req) => {
  const body = await req.text();  //Webhook request from Stripe
  const signature = headers().get("Stripe-signature");  //Extract the Stripe signature 

  let event;

  //This computes a signature, based on the payload body and webhook secret.
  //If the outcome (event) matches the signature extracted from the header, then the req is valid.
  try {
    event = stripe.webhooks.constructEvent( 
      body,
      signature,  //Signature is only used for comparison with the computed signature from body and secret.
      process.env.STRIPE_WEBHOOK_SECRET
    )

  } catch(error) {
    return new NextResponse(`Webhook error: ${error.message}`, {status: 400});
  };

  const session = event.data.object;

  if(event.type === "checkout.session.completed"){
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription  //To retrieve the subscription object.
    )
    console.log(subscription);

    const userId = session?.metadata.userId;

    //If we don't know who this subscription belongs to.
    if(!userId){
      return new NextResponse("User id is required", {status: 400})
    }

    await prisma.UserSubscription.create({
      data: {
        userId: userId,
        stripeCustomerId: subscription.customer,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000), //converts current period time stamp to a javaScript date object.
        //Js required time stamp to be in milliseconds.
      },
    })
  };

  //"invoice.payment_succeeded"
  //If a user upgraded their subscription and they already had one before. So their stripe account already exists.
  if(event.type === "customer.subscription.updated"){
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    );

    //Update the stripe subscription details.
    await prisma.UserSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      }
    })

  }

  return new NextResponse(null, {status: 200});
};



//We're only going to look for two events: checkout session completed, invoice payment succeeded.