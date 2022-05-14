
//IMPORTS:
    const mongoose = require ("mongoose");
    const bcrypt = require ("bcrypt");
    const jwt = require ("jsonwebtoken");
    const cfn = require("./config");


//BANCO DE DADOS:
    //importando e conectando o banco de dados
    const url = "mongodb+srv://camilycruz:ylimac2003@clustercliente.athp4.mongodb.net/db_autoEscola?retryWrites=true&w=majority";
    mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true})

    //Tabela de cadastro dos clientes
    const tabela = mongoose.Schema({
        nome:{type:String, required:true},
        email:{type:String, required:true, unique:true},
        cpf:{type:String, required:true, unique:true},
        senha:{type:String, required:true}
    });

    //Criptografia da tabela de cadastro dos clientes utilizando o bcrypt 
    tabela.pre("save", function(next){
        let cliente = this;
        if(!cliente.isModified('senha')) return next()
        bcrypt.hash(cliente.senha, 10, (erro,rs) => {
            if(erro) return console.log(`Erro ao criptografar senha ${erro}`);
            cliente.senha = rs;
            return next();
        })
    })
    
    //Execução da tabela de cadastro de clientes
    const Cliente = mongoose.model("tb_cliente", tabela);


//EXPRESS
    //importando o modulo express
    const express = require("express");
    //inserindo express na var app
    const app = express();
    //criando referencia para o servidor express
    app.use(express.json());
    


//CORS
    //importando cors
    const cors = require("cors");
    //criando referencia para o cors
    app.use(cors());



//ROTAS PARA OS VERBOS GET,POST,PUT E DELETE



    //GET-LISTAR TODOS OS CLIENTES
    //jwtverificacao-pedindo token para fazer a listagem de clientes
    app.get("/api/cliente/", /* jwtverificacao, */ (req,res)=>{
        Cliente.find((erro,dados)=>{
            if(erro){
                return res.status(400).send({msg:`Erro ao tentar listar os clientes " ${erro}"`})
            }
            res.status(200).send({msg:dados});
        }
        );
    });


    //POST-CADASTRAR
    app.post("/api/cliente/cadastro", (req,res) => {
    const cliente = new Cliente(req.body);
    cliente.save().then(() => {
        const gerado = criaToken(req.body.cpf,req.body.nome)
        res.status(201).send({msg:`Cliente cadastrado com sucesso`, tokenGerado:gerado});
    })
    .catch((erro) => res.status(400).send({msg:`Erro ao tentar cadastrar`, msgErro:erro}))
});


    //POST-LOGAR
    app.post("/api/cliente/login", (req,res) => {
        //var p cpf e senha
        const cpf = req.body.cpf;
        const sh = req.body.senha;

        //Procurndo cliente no db
        Cliente.findOne({cpf:cpf}, (erro, dados) => {
            //caso nao encontre o usuario
            if(erro){
                return res.status(400).send({msg:`Cliente não encontrado. ${erro}`});
            }


            //conferindo se a senha digitada pelo cliente esta igual a senha criptografada já salva no db
            bcrypt.compare(sh, dados.senha,(erro,igual) => {
                //em caso de erro
                if(erro) return res.status(400).send({msg:`Erro ao tentar logar. ${erro}`});
                //caso as senhas nao sejam iguais
                if(!igual) return res.status(400).send({msg:`Erro ao tentar logar. ${erro}`});

                const gerado = criaToken(dados.cpf, dados.nome);
                res.status(200).send({msg:`Logado`, payload:dados, token:gerado});
            })
        });
    });



    //PUT-ATUALIZAR
    app.put("/api/cliente/atualizar/:id", jwtverificacao, (req,res) => {
        Cliente.findByIdAndUpdate(req.params.id, req.body, (erro,dados) => {
            if(erro){
                return res.status(400).send({msg:`Erro ao tentar atualizar dados do cliente. ${erro}`});
            }
            res.status(200).send({msg:`Dados atualizados`});
        })
    });



    //DELETE-APAGAR
    app.delete("/api/cliente/apagar/:id", jwtverificacao, (req,res) => {
        Cliente.findByIdAndDelete(req.params.id, (erro,dados) => {
            if(erro){
                return res.status(400).send({msg:`Erro ao tentar apagar cliente ${erro}`})
            }
            res.status(204).send({msg:"Cliente excluido"});
        });
    });

    //GET-GERAR TOKEN
    const criaToken=(cpf, nome) => {
        return jwt.sign({cpf:cpf, nome:nome}, cfn.jwtchave, {expiresIn:cfn.jwtexpiracao});
    };


    //GET-VERIFICAÇAO DO TOKEN
    function jwtverificacao (req, res, next){
        const tokenGerado = req.headers.token;
        //caso nao seja passado nenhum token
        if(!tokenGerado){
            return res.status(401).send({msg:`Não há token`})
        }
        //verificando se o token e valido
        jwt.verify(tokenGerado, cfn.jwtchave, (erro,dados) => {
            if(erro){
                return res.status(401).send({msg:`Token inválido`});
            }
            next();
        });
    };


//PORTA DE COMUNICAÇAO PARA O SERVIDOR: 3000
    app.listen(3000,()=>console.log("Servidor online"));