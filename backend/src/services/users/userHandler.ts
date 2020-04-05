import { INativeEventMeta, toKaterEvent, KaterEvent } from "krs-backend-es";
import { OCBaseProjection } from "krs-backend-es/dist/oc";
import models from "../../models";
import { UserDocs } from "../../models/user";
import { Options } from "../../infra/IProjection";
import {
  UserVerified,
  UserDeleted,
  UserDetailsSet,
  UserInvited
} from "krs-backend-es/dist/ocuser/domain";
const listenEvents: any[] = [
  UserVerified,
  UserInvited,
  UserDeleted,
  UserDetailsSet
];

export const handle = async (
  event: KaterEvent,
  meta: INativeEventMeta,
  live?: boolean
): Promise<void> => {
  const query = { id: event.metadata.aggregate };
  if (event instanceof UserInvited) {
    await models.User.findOneAndUpdate(
      query,
      {
        id: event.metadata.aggregate,
        email: event.email,
        role: event.role,
        token: event.token,
        verified: false
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
  } else if (event instanceof UserVerified) {
    await models.User.findOneAndUpdate(query, {
      password: event.password,
      token: "",
      verified: true
    });
  } else if (event instanceof UserDeleted) {
    await models.User.findOneAndUpdate(query, { deleted: true });
  }
};

export default class UserHandler extends OCBaseProjection {
  constructor(
    persistrApiKey: string,
    spaceName: string,
    domainName: string,
    filterEvents: boolean
  ) {
    super(
      models.Cursor,
      "shell.users",
      listenEvents,
      persistrApiKey,
      spaceName,
      domainName,
      handle,
      "UserComponent",
      filterEvents
    );
  }

  public async getUser(query: any, options?: Options): Promise<UserDocs[]> {
    if (!(await this.isLive())) {
      throw new Error("User Projection is not ready");
    }
    return models.User.find(query)
      .skip(options ? (options.pageNumber - 1) * options.pageSize : 0)
      .limit(options ? options.pageSize : 100)
      .sort(options ? options.sortBy : {});
  }
  public async getUsersCount(query: any): Promise<number> {
    if (!(await this.isLive())) {
      throw new Error("User Projection is not ready");
    }
    return models.User.find(query).countDocuments();
  }
}
