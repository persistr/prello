import models from "../../../models";
import { UpdateUserQuery, UserQuery } from "../user.types";
import { UserProps } from "../../../models/user";
export const createUser = async (params: UserProps): Promise<any> => {
  const user = new models.User(params);
  await user.save();
};

export const getUser = async (query: UserQuery): Promise<any> =>
  await models.User.findOne(query);

export const getUsers = async (query: UserQuery, options: any): Promise<any> =>
  await models.User.find(query)
    .skip(options ? (options.pageNumber - 1) * options.pageSize : 0)
    .limit(options ? options.pageSize : 100)
    .sort(options ? options.sortBy : {});

export const getUsersCount = async (query: UserQuery): Promise<any> =>
  await models.User.find(query).countDocuments();

export const updateUser = async (
  query: UpdateUserQuery,
  params: UserProps
): Promise<any> =>
  await models.User.updateOne(
    query,
    params,
    (err: any, affected: any, resp: any) => {
      console.error(err, resp);
    }
  );
