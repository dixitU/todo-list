import { useState } from "react";
import constate from "constate";

export function useConstant() {
  const [initialRoute, setInitialRoute] = useState("");
  return {
    initialRoute,
    setInitialRoute,
  };
}

export const [ConstantProvider, useConstantContext] = constate(useConstant);
