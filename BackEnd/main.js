/* 
Como executar:
  -'npm start' no terminal;
*/

//Importamos o express
import express from "express";

//Criamos uma aplicação com o express
const app = express();

//Fazemos Parse de requests JSON, disponibilizando o seu conteudo no request.body de cada controller
app.use(express.json());

//Isto será para fazer as várias routes
//app.use("/exemplo1", Router1);
//app.use("/exemplo2", Router2);
//app.use("/exemplo3", Router3);
//app.use("/exemplo4", Router4);

app.listen(5173, () => {
  console.log("SOUND TEST!");
});
