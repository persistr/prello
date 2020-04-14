import models from "../../models";
import { UserDocs } from "../../models/user";
import BaseProjection from '../../utils/BaseProjection';
import {
  UserDeleted,
  UserSignedUp
} from "./domain/events";
const listenEvents: any[] = [
  UserDeleted,
  UserSignedUp
];

export const handle = async (
  event: any
): Promise<void> => {
  const query = { id: event.metadata.aggregate };
};

export default class UserHandler extends BaseProjection {
  constructor(
    dbName: string,
    nameSpace: string
  ) {
    super(dbName, nameSpace);
  }

  public async getUser(query: any, options?: any): Promise<UserDocs[]> {
    return models.User.find(query)
      .skip(options ? (options.pageNumber - 1) * options.pageSize : 0)
      .limit(options ? options.pageSize : 100)
      .sort(options ? options.sortBy : {});
  }
  public async getUsersCount(query: any): Promise<number> {
    return models.User.find(query).countDocuments();
  }
}
