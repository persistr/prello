import { ICommandMetadata, ICommand } from "../../../../infra/IEvent";
import { IsCommandMetadata } from "../../../../utils/customDTODecorators/IsCommandMetadata";

export class DeleteUserDTO implements ICommand {
  @IsCommandMetadata()
  public metadata: ICommandMetadata;

  constructor(metadata: ICommandMetadata) {
    this.metadata = metadata;
  }
}
