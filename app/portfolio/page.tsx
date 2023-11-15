import ThemeSwitch from "@/components/theme/ThemeSwitch";
import { msgs } from "@/messages";

const Home: React.FC = () => {
	const test = msgs("NavBar")("signInWith", { provider: "Google" });

	return (
		<div className="h-full w-full flex justify-center items-center flex-col gap-4 p-4">
			<ThemeSwitch />
			{test}
		</div>
	);
};

export default Home;
