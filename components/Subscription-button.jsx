"use client"
import { useState } from "react";
import { Button } from "@components/ui/button";
import { Zap } from "lucide-react";
import toast from "react-hot-toast";

const SubscriptionButton = ({isPro}) => {
  const [isLoading, setIsLoading] = useState(false)

  const onClick = async() => {
    try {
      setIsLoading(true);

      const response = await fetch("api/stripe", {
        method: "GET",
        headers: {
          "Content-Type" : "application/json",
        },
      })

      const data = await response.json();
      window.location.href = data.url;  //Refers to the checkout page or billing portal.

    } catch(error) {
      toast.error("Something went wrong")
    } finally{
      setIsLoading(false)
    }
  };

  return (
    <Button
      variant={isPro ? "default" : "premium"}
      onClick={onClick}
      disabled={isLoading}
    >
      <div className="font-bold flex">
        {isPro ? "Manage Subscription" : "Upgrade"}
        {!isPro && <Zap className="w-4 h-4 ml-2 fill-white" />}
      </div>
    </Button>
  );
}

export default SubscriptionButton; 