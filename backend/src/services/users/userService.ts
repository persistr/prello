import { Request, Response } from "express";
import mongoose from "mongoose";
import UserHandler from "./userHandler";
import UserCommandHandler from "./userCommandHandler";
import getRoutes from "./routes";

export default class UserService {
  private readonly userHandler: UserCommandHandler;
  private readonly userProjection: UserHandler;
  private readonly mongodbUrl: string;
  private readonly domain: string;
  private readonly space: string;

  constructor(
    persistrApiKey: string,
    mongoUrl: string,
    space: string,
    domain: string
  ) {
    console.log(`initializing ${this.constructor.name}...`);
    this.domain = domain;
    this.space = space;
    this.userProjection = new UserHandler(persistrApiKey, space, domain, true);
    this.userHandler = new UserCommandHandler();
    this.mongodbUrl = mongoUrl;
    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () =>
      console.log(`Connected successfully to mongodb database`)
    );
    mongoose.connect(this.mongodbUrl, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false
    });
    this.userHandler.connect(this.space, this.domain);
    console.log(`start connecting to ${this.space} of ${this.domain}...`);
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
