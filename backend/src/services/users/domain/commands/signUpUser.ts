import { SignUpUserDTO } from "../dtos/index";
import { UserSignedUp } from "../events/UserSignedUp";

export async function signUpUser(cmd: SignUpUserDTO): Promise<any[]> {
  return [new UserSignedUp(cmd.email, cmd.password)];
}
