import { Route } from "../utils";
import ItemService from "./items/itemService";
import UserService from "./users/userService";
import mongoose from "mongoose";

export let itemsService: any = null;
export let usersService: any = null;

const connectToMongoDb = () => {
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () =>
    console.log(`Connected successfully to mongodb database`)
  );
  mongoose.connect(process.env.MONGODB_URI||'', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
  });
}

// initializing services
try {
  connectToMongoDb();
  const dbName = 'example';
  const nameSpace = 'tasks';
  usersService = new UserService(dbName, nameSpace);
  // itemsService = new ItemService();
} catch (e) {
  console.error(e);
}

export const getRoutes = (): any => {
  const itemsRoutes: Route[] = itemsService.getRoutes();
  const usersRoutes: Route[] = usersService.getRoutes();

  return [
    ...itemsRoutes,
    ...usersRoutes
  ];
};
