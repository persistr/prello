import { ICommandMetadata, ICommand } from "../../../../infra/IEvent";
import { IsCommandMetadata } from "../../../../utils/customDTODecorators/IsCommandMetadata";
import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class VerifyUserDTO implements ICommand {
  @IsCommandMetadata()
  public metadata: ICommandMetadata;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public password: string;

  constructor(metadata: ICommandMetadata, email: string, password: string) {
    this.metadata = metadata;
    this.email = email;
    this.password = password;
  }
}
