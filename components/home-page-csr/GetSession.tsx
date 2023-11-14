import React from "react";

import { getServerSession } from "next-auth";

import { cn } from "@/lib/cn-utils";
import { authOptions } from "@/lib/auth-options";

// import styles from "./_getsession.module.scss";

interface Props {
	className?: string;
}

const GetSession: React.FC<Props> = async ({ className }) => {
	const session = await getServerSession(authOptions);

	return <div className={cn(className)}>{session?.user?.email}</div>;
};

export default GetSession;
