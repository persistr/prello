import { VerifyUserDTO } from "../dtos/index";
import { KaterEvent } from "krs-backend-es";
import buildEventMetadata from "../../../../utils/buildEventMetadata";
import { UserVerified } from "krs-backend-es/dist/ocuser/domain";

export async function verifyUser(cmd: VerifyUserDTO): Promise<KaterEvent[]> {
  const md = buildEventMetadata(cmd.metadata);
  return [new UserVerified(md, cmd.email, cmd.password)];
}
