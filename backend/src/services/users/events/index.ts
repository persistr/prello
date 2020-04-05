import { IEventCensor, IEventCreator } from "../../../infra/IEvent";
export const creators: {
  [name: string]: IEventCreator & Partial<IEventCensor>;
} = toLowerCaseKeys({});

function toLowerCaseKeys(obj: { [name: string]: IEventCreator }) {
  const result: { [name: string]: IEventCreator } = {};
  Object.keys(obj).forEach(key => {
    result[key.toLowerCase()] = obj[key];
  });
  return result;
}
