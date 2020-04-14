import { Request, Response } from "express";
import UserHandler from "./userHandler";
import UserCommandHandler from "./userCommandHandler";
import getRoutes from "./routes";

export default class UserService  {
  private readonly userHandler: UserCommandHandler;
  private readonly userProjection: UserHandler;
  private readonly dbName: string;
  private readonly nameSpace: string;

  constructor(
    dbName: string,
    nameSpace: string
  ) {
    console.log(`initializing ${this.constructor.name}...`);
    this.dbName = dbName;
    this.nameSpace = nameSpace;
    this.userProjection = new UserHandler(dbName, nameSpace);
    this.userHandler = new UserCommandHandler();
    this.userHandler.connect(this.dbName, this.nameSpace);
    console.log(`start connecting to db:${this.nameSpace} of namespace:${this.dbName}...`);
  }

  public async start() {
    try {
      await this.userProjection.connect();
    } catch (e) {
      console.error("Error: " + e + " in NotesComponent. Restarting...");
      await this.start();
    }
  }

  public getRoutes() {
    return getRoutes(this.userHandler);
  }
}
