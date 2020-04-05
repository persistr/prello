import { ICommandMetadata, ICommand } from "../../../../infra/IEvent";
import { IsCommandMetadata } from "../../../../utils/customDTODecorators/IsCommandMetadata";
import { IsNotEmpty, IsString, IsEmail } from "class-validator";
import { IsUserTypeDTO } from "~/utils/customDTODecorators/IsAdminTypeDTO";

export class InviteUserDTO implements ICommand {
  @IsCommandMetadata() //
  public metadata: ICommandMetadata;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  constructor(
    metadata: ICommandMetadata,
    email: string,
  ) {
    this.metadata = metadata;
    this.email = email;
  }
}
