"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { useProModalStore } from "@hooks/use-pro-modal";
import { Badge } from "@components/ui/badge";
import { Card } from "@components/ui/card";
import { tools } from "@app/(dashboard)/(routes)/dashboard/page";
import { cn } from "@lib/utils";
import { Check, Zap } from "lucide-react";
import { Button } from "@components/ui/button";
import toast from "react-hot-toast";

const ProModal = () => {
  const { isOpen, onOpen, onClose } = useProModalStore();
  const [isloading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onSubscribe = async() => {
    try {
      setIsLoading(true);

      const response = await fetch("api/stripe", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });

      const data = await response.json()
      window.location.href = data.url;

    } catch(error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false);
    }
  };

  //Open prop, if it has no value then default to true. Dialog will be shown based on this prop.
  //onOpenChange called, when the open state changes.
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-2 font-bold  py-1">
              Upgrade to Genius
              <Badge variant="premium" className="uppercase text-sm py-1">
                pro
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
            {tools.map(
              (
                tool //Dialogdesc. is a blog level element so all the children will be stacked vertically, cause they are block level.
              ) => (
                <Card
                  key={tool.label}
                  className="p-3 border-black/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                      <tool.icon className={cn("w-6 h-6", tool.color)} />
                    </div>
                    <div className="text-sm font-semibold">{tool.label}</div>
                  </div>
                  <Check className="text-primary w-5 h-5" />
                </Card>
              )
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            onClick={onSubscribe}
            disabled={isloading}
            size="lg" 
            variant="premium" 
            className="w-full font-bold">
            Upgrade
            <Zap className="fill-white w-4 h-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ProModal