//Escondendo a chave secreta "chavesecretadotoken"
const cfn = () => {
    return{
        //chave do token
        jwtchave:"chavesecretadotoken",
        //tempo de expiracao do token
        jwtexpiracao:"2d"
    }
}
module.exports = cfn();