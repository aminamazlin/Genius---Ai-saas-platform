import { auth } from "@clerk/nextjs/server";
import prisma from "./db";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async() => {
  const { userId } = auth();

  if(!userId) {
    return false
  }

  const userSubscription = await prisma.UserSubscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      stripePriceId: true,
      stripeCurrentPeriodEnd: true
    }
  });

  if(!userSubscription){
    return false;
  }

  //Checks the payment plan and if the end period is expired. give 1 day grace period.
  const isValid = 
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now();


  return !!isValid  //Strictly a boolean.
};