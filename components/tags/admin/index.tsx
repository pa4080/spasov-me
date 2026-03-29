"use client";

import React from "react";

import LoadingPage from "@/app/admin/loading";
import { useAppContext } from "@/contexts/AppContext";
import { tagTuple } from "@/interfaces/_common-data-types";

import styles from "../_tags.module.css";
import Section from "./Section";
import SectionIndex from "./SectionIndex";

interface Props {
  className?: string;
}

const TagsAdmin: React.FC<Props> = ({ className }) => {
  const { tags } = useAppContext();

  if (!tags || tags.length === 0) {
    return <LoadingPage />;
  }

  return (
    <div className={`${styles.about} ${className}`}>
      <SectionIndex />
      {tagTuple.map((tagType) => (
        <Section key={tagType} type={tagType} />
      ))}
    </div>
  );
};

export default TagsAdmin;
