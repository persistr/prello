require("dotenv").config();
import express from "express";
import middleware from "./middleware";
import errorHandlers from "./middleware/errorHandlers";
import { getRoutes } from "./services";
import { applyMiddleware, applyRoutes } from "./utils";

const app = express();

applyMiddleware(middleware, app);
applyRoutes(getRoutes(), app);
applyMiddleware(errorHandlers, app);

app.options("/*", (req, res, next) => {
  res.sendStatus(200);
});

const port = 3001;
app.listen(port, () => console.log(`app listening on port ${port}!`));

export default app;
