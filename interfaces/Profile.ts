import { PostTypeFromDb } from "./Post";
import { UserObject } from "./User";

export interface UserProfileType {
	user: UserObject;
	posts: PostTypeFromDb[];
}
