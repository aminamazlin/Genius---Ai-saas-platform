import { Settings } from "lucide-react";
import Heading from "@components/Heading";
import { checkSubscription } from "@lib/subscription";
import SubscriptionButton from "@components/Subscription-button";


const SettingsPage = async() => {
  const isPro = await checkSubscription();

  return (
    <div>
      <Heading
        title="Settings"
        description="Manage account settings."
        Icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />

      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isPro ? 
            "You are currently on a Pro Plan." 
            :"You are currently on a Free Plan."
          }
        </div>
        <SubscriptionButton isPro={isPro}/>
      </div>
    </div>
  );
}

export default SettingsPage