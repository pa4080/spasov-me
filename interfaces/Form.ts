import { PostType, PostErrorsType, PostTypeFromDb } from "@/interfaces/Post";

interface FormProps {
	handleSubmit: (e: React.SyntheticEvent) => void;
	handleFileUploadChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	post: PostType | PostTypeFromDb;
	setPost: React.Dispatch<React.SetStateAction<PostType | PostTypeFromDb>>;
	submitting: boolean;
	type: FormTypes;
	errors: PostErrorsType | null;
	image: string | null;
}

enum FormTypes {
	CREATE = "create",
	EDIT = "edit",
}
