import {
  handleBodyRequestParsing,
  handleCors,
  handleOptions
} from "./common";

export default [
  handleCors,
  handleBodyRequestParsing,
  handleOptions
];
