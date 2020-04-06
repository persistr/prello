import { DeleteUserDTO } from "../dtos/index";
import { UserDeleted } from "../events/UserDeleted";

export async function deleteUser(cmd: DeleteUserDTO): Promise<any[]> {
  return [new UserDeleted()];
}
