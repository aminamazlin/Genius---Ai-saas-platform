"use client"
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

import { Button } from "@components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@components/ui/sheet";
import SideBar from "@components/SideBar";


const MobileSidebar = ({apiLimitCount, isPro}) => {
  const [isMounted, setisMounted] = useState(false)

  useEffect(()=> {
    setisMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SideBar isPro={isPro} apiLimitCount={apiLimitCount}/>
      </SheetContent>
    </Sheet>
  );
}

export default MobileSidebar
