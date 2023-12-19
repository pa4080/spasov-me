import React from "react";

import styles from "./_contact.module.scss";

import ContactForm from "./ContactForm";

interface Props {
	className?: string;
}

const Contact: React.FC<Props> = ({ className }) => {
	return (
		<div className={`${styles.contact} ${className}`}>
			<div className={styles.wrapper}>
				<ContactForm />
			</div>
		</div>
	);
};

export default Contact;
