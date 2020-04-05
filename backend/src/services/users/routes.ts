import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy } from 'passport-local';

import { ExtractJwt } from "passport-jwt";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import path = require("path");
import { v4 as uuid } from "uuid";

// User Routes
import {
  createSingleUser,
  getSingleUser,
  getManyUsers,
  getManyUsersCount,
  updateSingleUser
} from "./UsersController";

// Infra
import { HTTP400Error } from "../../utils/httpErrors";
import queryBuilder from "../../utils/queryBuilder";
import { Route } from "../../utils";
import { generateJwtToken } from "../../utils/generateJwtToken";

// User ID Service
import UserCommandHandler from "~/services/users/userCommandHandler";
import {
  InviteUserDTO,
  SetUserDetailsDTO,
  VerifyUserDTO,
  DeleteUserDTO
} from "./domain/dtos";
import {
  inviteUser,
  setUserDetails,
  verifyUser,
  deleteUser
} from "./domain/commands/";

const tokenOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || ''
};

const secret = process.env.JWT_SECRET;

export default function getRoutes(commandHandler: UserCommandHandler) {
  return [
    new Route("/login", "post", [
      async (req: Request, res: Response) => {
        const { email, password, rememberMe } = req.body;
        let token, user: any;
        user = await getSingleUser({ email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
          res.status(401).json({ message: "Incorrect username or password" });
        } else {
          if (rememberMe) {
            token = jwt.sign(
              { email: user.email, role: user.role },
              tokenOptions.secretOrKey
            );
          } else {
            token = jwt.sign(
              { email: user.email, role: user.role },
              tokenOptions.secretOrKey,
              {
                expiresIn: "24h"
              }
            );
          }
          user.token = token;
          res.status(200).json({
            success: true,
            message: "Authentication successful!",
            email,
            token
          });
        }
      }
    ]),
    new Route("/signUp", "post", [
      async (req: Request, res: Response) => {
        const { email } = req.body;
        let token: string;
        if (!email) {
          throw new HTTP400Error("Missing email address");
        }

        const user = await getSingleUser({ email: email.toLowerCase() });

        if (user) {
          res.status(200).json({
            success: false,
            message: "User already exists!"
          });
        } else {
          const id = uuid();
          token = await generateJwtToken(
            { email: email.toLowerCase() },
            { expiresIn: "48h" }
          );

          const payload: InviteUserDTO = {
            email,
            metadata: {
              id: uuid(),
              aggregate: id,
              timestamp: new Date().toISOString()
            }
          };
          await inviteUser(payload)
            .then(async event => {
              await commandHandler.writeToStream(event, 1, id);
              await res.status(200).json({
                success: true,
                message:
                  "User Created! User: " + email + ". Invitation Also Sent!"
              });
            })
            .catch(error => res.status(503).json({ error: error.message }));
        }
      }
    ]),
    new Route("/users", "get", [
      async (req: Request, res: Response) => {
        const { query, options } = await queryBuilder(req.query);
        try {
          const usersList = await getManyUsers(query, options);
          const usersCount: number = await getManyUsersCount(query);
          res.status(200).send({
            data: usersList
          });
        } catch (e) {
          console.error(e);
          res.status(503).json({ message: e });
        }
      }
    ]),
    new Route("/users/:id", "post", [
      async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await getSingleUser({ id });
        if (user) {
          const payload: DeleteUserDTO = {
            metadata: {
              id: uuid(),
              aggregate: id,
              timestamp: new Date().toISOString()
            }
          };
          await deleteUser(payload).then(async event => {
            await commandHandler.writeToStream(event, 1, payload.metadata.id);
            await res.status(200).json({
              success: true,
              message: "User Deleted! User: " + user.email + ""
            });
          });
        } else {
          res.status(400).json({ message: "User Not found" });
        }
      }
    ])
  ];
}
