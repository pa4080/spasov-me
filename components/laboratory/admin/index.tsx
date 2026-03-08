"use client";

import React from "react";

import LoadingPage from "@/app/admin/loading";
import { useAppContext } from "@/contexts/AppContext";
import { labEntryTuple } from "@/interfaces/_common-data-types";
import { cn } from "@/lib/cn-utils";

import Section from "./Section";

interface Props {
  className?: string;
}

const LabAdmin: React.FC<Props> = ({ className }) => {
  const { labEntries, tags, fileList, iconList, iconsMap } = useAppContext();

  if (labEntries.length === 0) {
    return <LoadingPage />;
  }

  return (
    <div className={cn("space-y-20", className)}>
      {labEntryTuple.map((type) => (
        <Section
          key={type}
          fileList={fileList}
          iconList={iconList}
          iconsMap={iconsMap}
          labEntries={labEntries}
          tags={tags}
          type={type}
          visibleItems={2}
        />
      ))}
    </div>
  );
};

export default LabAdmin;
