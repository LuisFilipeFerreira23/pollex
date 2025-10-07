import mongodb from "mongodb";

const MongoClient = mongodb.MongoClient;

let _db;

export const mongoConnect = (callback) => {
  MongoClient.connect("{INSERT_CONNECTION_STRING_HERE}")
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
