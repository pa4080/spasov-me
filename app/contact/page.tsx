import Contact from "@/components/contact";
import { msgs } from "@/messages";

const Home: React.FC = () => {
	const t = msgs("Contact");

	return (
		<div className="margin_vh_top margin_vh_bottom">
			<h1 className="section_title">{t("title")}</h1>
			<Contact className="bg-secondary px-5 py-3 rounded-2xl" />
		</div>
	);
};

export default Home;
