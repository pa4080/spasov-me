/**
 * @see https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
 */

import React from "react";

interface Props {
	params: { slug: string[] };
}

const Project: React.FC<Props> = ({ params }) => {
	return <div>{params.slug.join(", ")}</div>;
};

export default Project;
