import express from "express";

const app = express();

app.use(express.json());

app.listen(5173, () => {
  console.log("SOUND TEST!");
});
