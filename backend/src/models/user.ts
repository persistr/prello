import * as mongoose from "mongoose";
import {
  createSchema,
  ExtractProps,
  ExtractDoc,
  Type,
  typedModel
} from "ts-mongoose";

const userSchema = createSchema({
  id: Type.string({ unique: true, index: true }),
  email: Type.string({ unique: true, sparse: true }),
  password: Type.string(),
  deleted: Type.boolean({ default: false })
});

export default typedModel("User", userSchema, "shell.users");

userSchema.index({ "$**": "text" });

type UserProps = ExtractProps<typeof userSchema>;
type UserDocs = ExtractDoc<typeof userSchema>;
export { UserDocs, UserProps, userSchema };
