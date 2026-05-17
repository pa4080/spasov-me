import packageJson from "@/package.json";

const AppVersion: React.FC = () => {
  return (
    <span className="text-muted-foreground text-xs right-0 top-0  absolute">
      v.{packageJson?.version}
    </span>
  );
};

export default AppVersion;
