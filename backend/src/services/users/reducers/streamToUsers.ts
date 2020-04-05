import KaterEvent from "../events/KaterEvent";
import {
  UserInvited,
  UserDeleted,
  UserDetailsSet,
  UserVerified
} from "krs-backend-es/dist/ocuser/domain";
import { User } from "../domain/User";
export const noteReducer = (user: User, event: KaterEvent): User => {
  let e;
  switch (event.constructor) {
    case UserInvited:
      e = event as UserInvited;
      console.log("reducer for user", e, user);
      return user;
    case UserDetailsSet:
      e = event as UserDetailsSet;
      console.log("reducer for user", e, user);
      return user;
    case UserVerified:
      e = event as UserVerified;
      console.log("reducer for user", e, user);
      return user;
    case UserDeleted:
      e = event as UserDeleted;
      console.log("reducer for user", e, user);
      return user;
    default:
      return user;
  }
};
