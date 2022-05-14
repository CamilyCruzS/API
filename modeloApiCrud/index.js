//######## SERVIDOR #########
//criando servidor utilizando o modulo express:
const express = require("express");

//criando referencia servidor express:
const app = express();

//fazendo o servidor express receber e tratar dados no formato json
app.use(express.json());


//####### CORS #########
//importando o modulo cors
const cors = require("cors");



//########## CRUD ######################
//Criação das rotas para realizar o CRUD, usando os verbos GET, POST, PUT, DELETE
//GET(Obter)
//LISTAR TODOS OS CLIENTES
app.get( "/api/cliente/", (req, res) => {
    res.send ("Todos os clientes cadastrados");
});

//LISTAR UM CLIENTE
app.get("/api/cliente/:id", (req, res) => {
    res.send ("Cliente fulano");
});


//POST(Cadastrar)
app.post("/api/cliente/cad", (req, res) => {
    res.send( `Os dados enviados foram ${ req.body.nome} `);
});


//PUT
app.put("/api/cliente/atualizar/:id", (req, res) => {
    res.send(`O id passado foi ${req.params.id} e os dados para atualização são ${req.body} `);
});


//DELETE
app.delete("/api/cliente/apagar/:id", (req, res) => {
    res.send(`O id passado foi ${req.params.id} `);
});


//possibilitando a inicializaçao do servidor na porta 3000
app.listen(3000,()=>console.log("Servidor online na porta 3000"));