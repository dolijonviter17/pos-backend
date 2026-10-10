import { Schema, Document, Model, model } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  authentication: {
    password: string;
    salt: string;
    sessionToken: string;
  };
}

const UserSchema: Schema = new Schema({
  username: { type: String, require: true },
  email: { type: String, require: true },
  numberPhone: { type: Number, require: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

export const UserModel: Model<IUser> = model<IUser>("User", UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserByNumberPhone = (numberPhone: number) =>
  UserModel.findOne({ numberPhone });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({
    "authentication.sessionToken": sessionToken,
  });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
