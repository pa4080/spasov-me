"use client";

import { useActualVh } from "@/hooks/useActualVh";
import { useClearHyphens } from "@/hooks/useClearHyphens";
import { useCodeCopyButton } from "@/hooks/useCodeCopyButton";
import { useScrollToAboutEntry } from "@/hooks/useScrollToAboutEntry";

interface Props {
  children: React.ReactNode;
}

const UseInteractiveFeatures: React.FC<Props> = ({ children }) => {
  useClearHyphens();
  useCodeCopyButton();
  useScrollToAboutEntry();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { vh } = useActualVh();

  return children;
};
export default UseInteractiveFeatures;
