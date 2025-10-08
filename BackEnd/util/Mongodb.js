import mongodb from "mongodb";
// Importa dotenv para variáveis de ambiente
import dotenv from "dotenv";
const MongoClient = mongodb.MongoClient;

let _db;

dotenv.config({
  override: true,
  path: "./util/mongodb.env",
});

export const mongoConnect = (callback) => {
  MongoClient.connect(`${process.env.CS}`)
    .then((client) => {
      console.log("\n\nConnected\n\n");
      _db = client.db();
      callback();
    })
    .catch((error) => {
      console.log("\n\nError: ", error);
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "\n\nNO DB FOUND\n\n";
};
