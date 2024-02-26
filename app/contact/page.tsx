import Contact from "@/components/contact";
import { msgs } from "@/messages";

const Home: React.FC = () => {
	const t = msgs("Contact");

	return (
		<div className="margin_vh_top margin_vh_bottom scroll-m-40">
			<h1 className="section_title">{t("title")}</h1>
			<Contact />
		</div>
	);
};

export default Home;
