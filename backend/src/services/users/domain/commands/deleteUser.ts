import { DeleteUserDTO } from "../dtos/index";
import buildEventMetadata from "../../../../utils/buildEventMetadata";
import { UserDeleted } from "krs-backend-es/dist/ocuser/domain";

export async function deleteUser(cmd: DeleteUserDTO): Promise<any[]> {
  const md = buildEventMetadata(cmd.metadata);
  return [new UserDeleted(md)];
}
