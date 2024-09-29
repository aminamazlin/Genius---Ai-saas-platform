import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@lib/db";
import { stripe } from "@lib/stripe";
import { absoluteUrl } from "@lib/utils";
import { metadata } from "@app/layout";

const settingsUrl = absoluteUrl("/settings");

export const GET = async(req) => {
  try {
    const {userId} = auth();
    const user = await currentUser();

    if(!userId || !user){
      return new NextResponse("Unauthorized", {status: 401});
    }

    const userSubscription = await prisma.userSubscription.findUnique({
      where: {    
        userId: userId,   //Finds the subscribed user based on the currently logged in user.
      },
    });
    
    //If the user is subscribed and has a Stripe account, create a billing portal to send the user to.
    if(userSubscription && userSubscription.stripeCustomerId){
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,    //Default url when customer clicks on the link to return to your website.
      });
      return NextResponse.json({url: stripeSession.url}, {status: 200}); //returns a portal session object. Here is accesses the session url (short-lived url)
    }

    //If the user is not subsribed. Checkout page.
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,  //Url to redirect to after succesfull payment.
      cancel_url: settingsUrl,  //Url to redirect to after cancelling payment.
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",   //Only collects the billing address when necessary.
      customer_email: user.emailAddresses[0].emailAddress, //From clerk.
      line_items: [
        {
          price_data:
            {
              currency: "EUR",
              product_data: {
                name: "Genius Pro",
                description: "Unlimited AI Generations",

              },
              unit_amount: 2000, //20 eur, in 1 cents.
              recurring: {
                interval: "month",
              },
            },
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
      },
    });
    return NextResponse.json({url: stripeSession.url}); //Url of checkout session.

  } catch(error) {
    console.log("[STRIPE_ERROR]", error);
    return new NextResponse("Internal error", {status: 500});
  }
};