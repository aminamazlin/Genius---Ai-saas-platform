import prisma from "@/lib/db";
import prismadb from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { MAX_FREE_COUNTS } from "@constants/constants";

export const increaseApiLimit = async() => {
  const { userId } = auth();

  if(!userId){
    return
  };

  const UserApiLimit = await prisma.UserApiLimit.findUnique({
    where: {
      userId: userId,
    },
  });

  if(UserApiLimit){
    await prisma.UserApiLimit.update({
      where: {
        userId: userId,
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });
  } else {
      await prisma.UserApiLimit.create({
        data: {
          userId: userId,
          count: 1,
        },
      });
  };  
};

export const checkApiLimit = async() => {
  const { userId } = auth();

  if(!userId){
    return false
  };

  const UserApiLimit = await prisma.UserApiLimit.findUnique({
    where: {
      userId: userId,
    },
  });

  if(!UserApiLimit || UserApiLimit.count < MAX_FREE_COUNTS){
    return true;
  } else {
    return false;
  }
};

//Increment method works best when you're updating an existing record.

export const getApiLimitCount = async() => {
  const { userId } = auth();

  if(!userId) {
    return 0
  };

  const UserApiLimit = await prisma.UserApiLimit.findUnique({
    where: {
      userId: userId,
    },
  });

  if(!UserApiLimit){
    return 0
  };

  return UserApiLimit.count;

};