// Item service handles the logic of the list application
import { Request, Response } from "express";
import _ from "lodash";
import Item from "../../models/Item";
import List from "../../models/List";
import { Route } from "../../utils";
import { move } from "../../utils/util";

import { uuid } from "uuidv4";

export default class ItemService {

  public lists: List[] = [];

  constructor() {
    console.log(`initializing ${this.constructor.name}...`);
  }

  public getRoutes() {
    return [
      new Route("/api/lists", "post", [
        async (req: Request, res: Response) => {
          try {
            const list = new List(uuid());
            this.lists.push(list);
            res.status(200).json({
              list
            });
          } catch (e) {
            console.log("error", e);
            res.status(503).json({ message: e });
          }
        }
      ]),
      new Route("/api/lists", "get", [
        async (req: Request, res: Response) => {
          try {
            res.status(200).json({
              lists: this.lists
            });
          } catch (e) {
            console.log("error", e);
            res.status(503).json({ message: e });
          }
        }
      ]),
      new Route("/api/lists/:id", "get", [
        async (req: Request, res: Response) => {
          try {
            const id = req.params.id;
            const list = this.lists.find((list) => list.id === id);
            if (list) {
              res.status(200).json({
              list
            });
          } else {
            res.status(404).json({ message: "list not found." });
          }
          } catch (e) {
            console.log("error", e);
            res.status(503).json({ message: e });
          }
        }
      ]),
      new Route("/api/lists/:id/reset", "get", [
        async (req: Request, res: Response) => {
          try {
            const id = req.params.id;
            const list = this.lists.find((list) => list.id === id);
            if (list) {
              list.items = [];
              res.status(200).json({
              list
            });
          } else {
            res.status(404).json({ message: "list not found." });
          }
          } catch (e) {
            console.log("error", e);
            res.status(503).json({ message: e });
          }
        }
      ]),
      new Route("/api/lists/:id/items", "post", [
        async (req: Request, res: Response) => {
          try {
            const id = req.params.id;
            const itemTitle = req.body.title;
            const itemId = uuid();
            const list = this.lists.find((list) => list.id === id);
            if (list) {
              const item = new Item(itemId, itemTitle);
              list.items.push(item);
              res.status(200).json({
                  item
              });
            } else {
              res.status(404).json({ message: "list not found." });
            }
          } catch (e) {
            console.log("error", e);
            res.status(503).json({ message: e });
          }
        }
      ]),
      new Route("/api/lists/:id/items/:item_id", "delete", [
        async (req: Request, res: Response) => {
          try {
            const id = req.params.id;
            const itemId = req.params.item_id;
            const list = this.lists.find((list) => list.id === id);
            if (list) {
              const item = list.items.find((item) => item.id === itemId);
              if (item) {
                list.items.splice(_.indexOf(list.items, _.find(list.items, (item: any) => item.Id === itemId)), 1);
                res.status(200).json({ message: "deleted" });
              } else {
                res.status(404).json({ message: "item not found." });
              }
            } else {
              res.status(404).json({ message: "list not found." });
            }
          } catch (e) {
            console.log("error", e);
            res.status(503).json({ message: e });
          }
        }
      ]),
      new Route("/api/lists/:id/items/:item_id", "put", [
        async (req: Request, res: Response) => {
          try {
            const id = req.params.id;
            const itemId = req.params.item_id;
            const newItemIndex = req.body.index;
            const list = this.lists.find((list) => list.id === id);
            if (list) {
              const item = list.items.find((item) => item.id === itemId);
              if (item) {
                const oldIndex = _.indexOf(list.items, item);
                list.items = move(list.items, oldIndex, newItemIndex);
                res.status(200).json({ message: "re-ordered" });
              } else {
                res.status(404).json({ message: "item not found." });
              }
            } else {
              res.status(404).json({ message: "list not found." });
            }
          } catch (e) {
            console.log("error", e);
            res.status(503).json({ message: e });
          }
        }
      ]),
    ];
  }
}
