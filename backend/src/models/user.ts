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
  password: Type.optionalString(),
  verified: Type.boolean({ default: false }),
  token: Type.string(),
  role: Type.optionalString({ default: "ADMIN" }),
  deleted: Type.boolean({ default: false })
});

export default typedModel("User", userSchema, "shell.users");
// mongoose.set("useFindAndModify", false);

userSchema.index({ "$**": "text" });

type UserProps = ExtractProps<typeof userSchema>;
type UserDocs = ExtractDoc<typeof userSchema>;
export { UserDocs, UserProps, userSchema };
