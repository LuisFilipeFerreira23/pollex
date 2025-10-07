import { Pool, Client } from "pg";
import path from "path";

//Get the development variables on the .env file
require("dotenv").config({
  override: true,
  path: path.join(__dirname, "development.env"),
});

const client = new Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

await client.connect();

console.log(await client.query("SELECT NOW()"));

await client.end();
