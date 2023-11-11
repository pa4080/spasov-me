import ThemeStylePreview from "@/components/theme/ThemeStylePreview";
import ThemeSwitch from "@/components/theme/ThemeSwitch";

const Home: React.FC = () => {
	return (
		<main className="h-full w-full flex justify-center items-center flex-col gap-4 p-4">
			<ThemeSwitch />
			<ThemeStylePreview />
		</main>
	);
};

export default Home;
