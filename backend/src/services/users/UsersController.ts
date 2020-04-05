import { createUser, getUser, getUsers, updateUser, getUsersCount } from "./providers/UserDataProvider";
import { UpdateUserQuery, UserQuery } from "./user.types";
import {UserProps} from "../../models/user";

export const createSingleUser = async (params: UserProps) => createUser(params);
export const getSingleUser = async (query: UserQuery) => getUser(query);
export const getManyUsers = async (query: UserQuery, options: any) => getUsers(query, options);
export const getManyUsersCount = async (query: UserQuery) => getUsersCount(query);
export const updateSingleUser = async (query: UpdateUserQuery, params: UserProps) => updateUser(query, params);
