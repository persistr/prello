import { SetUserDetailsDTO } from "../dtos/index";
import { KaterEvent, NoteChecked } from "krs-backend-es";
import buildEventMetadata from "../../../../utils/buildEventMetadata";
import { UserDetailsSet } from "krs-backend-es/dist/ocuser/domain";

export async function setUserDetails(
  cmd: SetUserDetailsDTO
): Promise<KaterEvent[]> {
  const md = buildEventMetadata(cmd.metadata);
  return [new UserDetailsSet(md, cmd.email, cmd.role)];
}
