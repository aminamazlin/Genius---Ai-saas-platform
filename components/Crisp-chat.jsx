"use client"

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

const CrispChat = () => {
  useEffect(()=> {
    Crisp.configure("843198d7-553f-40ec-adb4-92ed2d10e041");
  }, []);

  return null;
};

export default CrispChat;