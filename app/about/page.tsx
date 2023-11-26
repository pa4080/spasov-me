import ThemeSwitch from "@/components/layouts/theme/ThemeSwitch";
import { msgs } from "@/messages";

const Home: React.FC = () => {
	const t = msgs("Navigation")("signInWith", { provider: "Google" });

	return (
		<div className="h-full w-full flex justify-center items-center flex-col gap-4 p-4">
			<p>About</p>
			<ThemeSwitch />
			{t}
		</div>
	);
};

export default Home;
