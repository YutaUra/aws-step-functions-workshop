import { Handler } from "aws-lambda";

export const handler: Handler<any> = async (event) => {
  console.log("Hello World");

  return "Hello World";
};
