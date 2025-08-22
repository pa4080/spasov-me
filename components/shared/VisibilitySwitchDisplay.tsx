"use client";
import React from "react";

import { Switch } from "@/components/ui/switch";
import { useAppContext } from "@/contexts/AppContext";

interface Props {
  className?: string;
  checked: boolean | string;
  disabled?: boolean;
}

const VisibilitySwitchDisplay: React.FC<Props> = ({ className, checked, disabled = true }) => {
  const { session } = useAppContext();

  if (!session) {
    return null;
  }

  return (
    <Switch
      checked={typeof checked === "string" ? (checked === "true" ? true : false) : checked}
      className={className}
      disabled={disabled}
    />
  );
};

export default VisibilitySwitchDisplay;
