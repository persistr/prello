import { NextFunction, Request, Response } from "express";
import { Route } from "../utils";
import ItemService from "./items/itemService";
const request = require("request-promise-native");
import users from "./users/routes";

export let item: any = null;

// server

try {
  item = new ItemService();
} catch (e) {
  console.error(e);
}

export const getRoutes = (): any => {
  const itemsRoutes: Route[] = item.getRoutes();

  return [
    ...itemsRoutes,
  ];
};
