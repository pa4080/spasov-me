import React from "react";

import IconEmbedSvg from "@/components/shared/IconEmbedSvg";
import { new_tab_target } from "@/lib/md/process-markdown";

import styles from "./_footer.module.css";

const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      <div className="max-w-4xl mx-auto relative flex items-center justify-center w-full h-footer overflow-hidden">
        <a
          aria-label="Link to GitHub"
          className={styles.iconWrapper}
          href="https://github.com/pa4080"
          target={new_tab_target}
        >
          <IconEmbedSvg
            className={styles.footerIcon}
            height={32}
            type="github-rounded"
            viewBoxHeight={512}
            viewBoxWidth={496}
            width={32}
          />
        </a>
        <a
          aria-label="Link to Ask Ubuntu"
          className={styles.iconWrapper}
          href="https://askubuntu.com/users/566421/pa4080"
          target={new_tab_target}
        >
          <IconEmbedSvg
            className={styles.footerIcon}
            height={32}
            type="ubuntu-aka-ask-ubuntu"
            viewBoxHeight={512}
            viewBoxWidth={496}
            width={32}
          />
        </a>
        <a
          aria-label="Link to MetaLevel Wiki"
          className={`${styles.iconWrapper} ${styles.iconWrapperSpecial}`}
          href="https://wiki.metalevel.tech"
          target={new_tab_target}
        >
          <IconEmbedSvg
            className={styles.footerIcon}
            height={32}
            type="metalevel-wiki"
            viewBoxHeight={591.94}
            viewBoxWidth={557.41}
            width={32}
          />
        </a>
        <a
          aria-label="Link to LinkedIn"
          className={styles.iconWrapper}
          href="https://www.linkedin.com/in/spas-z-spasov"
          target={new_tab_target}
        >
          <IconEmbedSvg
            className={styles.footerIcon}
            height={32}
            type="linkedin-square"
            viewBoxHeight={512}
            viewBoxWidth={448}
            width={32}
          />
        </a>
        <a
          aria-label="Link to Wikimedia"
          className={styles.iconWrapper}
          href="https://meta.wikimedia.org/wiki/User:Spas.Z.Spasov"
          target={new_tab_target}
        >
          <IconEmbedSvg
            className={styles.footerIcon}
            height={32}
            type="wikimedia"
            viewBoxHeight={897}
            viewBoxWidth={900}
            width={32}
          />
        </a>
      </div>
    </div>
  );
};

export default Footer;
