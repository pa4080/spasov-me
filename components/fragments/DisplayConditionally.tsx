"use client";

import { useAppContext } from "@/contexts/AppContext";

interface Props {
  children: React.ReactNode;
}

const DisplayConditionally: React.FC<Props> = ({ children }) => {
  const { session } = useAppContext();

  return session ? children : null;
};

export default DisplayConditionally;
