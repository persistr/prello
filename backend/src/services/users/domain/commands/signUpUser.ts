import { InviteUserDTO } from "../dtos/index";
import { UserInvited } from "krs-backend-es/dist/ocuser/domain";
import buildEventMetadata from "../../../../utils/buildEventMetadata";

export async function signUpUser(cmd: InviteUserDTO): Promise<any[]> {
  const md = buildEventMetadata(cmd.metadata);
  return [new UserInvited(md, cmd.email)];
}
