import React from "react";

import styles from "./_section-header.module.scss";

interface Props {
	className?: string;
	children?: React.ReactNode;
	title: string;
	label?: string;
}

/**
 * The { children } prop is expected to mb the section action buttons.
 */
const SectionHeader: React.FC<Props> = ({ className, children, title, label }) => {
	return (
		<div className={`${styles.sectionHeader} ${className}`}>
			<div className={styles.sectionActions}>{children}</div>
			<div>
				<h1 dangerouslySetInnerHTML={{ __html: title }} className={styles.sectionTitle} />
				{label && <p className="pl-1 text-secondary-foreground">{label}</p>}
			</div>
		</div>
	);
};

export default SectionHeader;
