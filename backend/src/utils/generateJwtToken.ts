import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

interface TokenParams {
  email: string;
}

interface TokenOptions {
  expiresIn: string;
}

export const generateJwtToken = async (params: TokenParams, options: TokenOptions | undefined): Promise<string> => jwt.sign(params, secret || "", options);
