export type UserObject = {
  _id: string;
  email: string;
  username: string;
  name: string;
  image: string;
  accountProvider: string;
  description?: string;
};

export type NewUserObject = Omit<UserObject, "_id">;
