import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class SignUpUserDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  constructor(
    email: string,
  ) {
    this.email = email;
  }
}
