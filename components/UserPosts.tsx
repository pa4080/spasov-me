import React from "react";
import { useTranslations } from "next-intl";

import { UserProfileType } from "@/interfaces/Profile";

import PostCardList from "./PostCardList";

const UserPosts: React.FC<UserProfileType> = ({ user, posts }) => {
	const t = useTranslations("Profile");

	return (
		<section className="page_section_left w-full">
			<PostCardList data={posts} />
		</section>
	);
};

export default UserPosts;
