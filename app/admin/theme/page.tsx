import ThemeStylePreview from "@/components/layouts/theme/ThemeStylePreview";

const Theme: React.FC = () => {
  return (
    <div className="h-full w-full flex justify-center items-center flex-col gap-4 p-4 scroll-mt-40">
      <ThemeStylePreview />
    </div>
  );
};

export default Theme;
