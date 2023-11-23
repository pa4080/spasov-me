import React from "react";

import { cn } from "@/lib/cn-utils";

import styles from "./_contact.module.scss";

import ContactForm from "./ContactForm";

interface Props {
	className?: string;
}

const Contact: React.FC<Props> = ({ className }) => {
	return (
		<div className={cn(styles.contact, className)}>
			<div className={cn(styles.wrapper, className)}>
				<ContactForm />
			</div>
		</div>
	);
};

export default Contact;
