import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card";
import { MAX_FREE_COUNTS } from "@constants/constants"
import { Progress } from "@components/ui/progress";
import { Button } from "@components/ui/button"
import { Zap } from "lucide-react";
import { useProModalStore } from "@hooks/use-pro-modal";

const FreeCounter = ({ apiLimitCount, isPro }) => {
  const {isOpen, onOpen, onClose} = useProModalStore();
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true);
  }, []);
  
  if(!mounted){
    return null
  };

  if(isPro){
    return null
  };

  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-4 space-y-2 font-bold">
            <p>
              {apiLimitCount}/{MAX_FREE_COUNTS} Free Generations
            </p>
            <Progress
              className="h-3"
              value={(apiLimitCount / MAX_FREE_COUNTS) * 100}
            />
          </div>
          <Button onClick={onOpen} className="w-full font-bold" variant="premium">
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white"/>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default FreeCounter;