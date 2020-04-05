import { ICommandMetadata, ICommand } from "../../../../infra/IEvent";
import { IsCommandMetadata } from "../../../../utils/customDTODecorators/IsCommandMetadata";
import { IsNotEmpty, IsString, IsEmail } from "class-validator";
import { IsUserTypeDTO } from "../../../../utils/customDTODecorators/IsAdminTypeDTO";
import { AdminType } from "../User";

export class SetUserDetailsDTO implements ICommand {
  @IsCommandMetadata()
  public metadata: ICommandMetadata;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsUserTypeDTO()
  public role: AdminType;

  @IsNotEmpty()
  @IsString()
  public token: string;

  constructor(
    metadata: ICommandMetadata,
    email: string,
    role: AdminType,
    token: string
  ) {
    this.metadata = metadata;
    this.email = email;
    this.role = role;
    this.token = token;
  }
}
