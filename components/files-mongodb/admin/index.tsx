import { getFiles_mongo } from "../_files.actions";
import Section from "./Section";

interface Props {
  className?: string;
}

const FilesAdmin_MongoDB: React.FC<Props> = async ({ className }) => {
  const files = await getFiles_mongo();

  const filesCommon = files?.filter(
    (file) => !file.metadata.attachedTo || file.metadata.attachedTo.length === 0
  );

  const filesAbout = files?.filter((file) =>
    file.metadata.attachedTo?.find(({ modelType }) => modelType === "AboutEntry")
  );

  const filesPortfolio = files?.filter((file) =>
    file.metadata.attachedTo?.find(({ modelType }) => modelType === "Project")
  );

  const filesLaboratory = files?.filter((file) =>
    file.metadata.attachedTo?.find(({ modelType }) => modelType === "LabEntry")
  );

  return (
    <div className={className}>
      <Section files={filesCommon} type="common" />
      <Section
        sortByAttachedTo
        files={filesLaboratory}
        sortByAttachedToVisibleItems={12}
        type="LabEntry"
        visibleItems={2}
      />
      <Section files={filesAbout} type="AboutEntry" />
      <Section sortByAttachedTo files={filesPortfolio} type="Project" visibleItems={1} />
    </div>
  );
};

export default FilesAdmin_MongoDB;
