"use strict";
// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static('public'));

// Chatroom

var numUsers = 0;

function Prefix(valve){
  var text = "MasterBaiter-";
  text+= valve;
  valve = text;
  return(valve);
}

function Sufix(valve){
  valve +="-gayLord";
  return(valve);
}


io.on('connection', function (socket) {
  var addedUser = false;
  
  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });
  
  
  // when the client emits 'new message', this listens and executes
  socket.on('Rola Dado', function (data) {
    
   // ver se a string esta no formato correto e explode ela.
    var comando = /\/([1-9][0-9]*)([dit])([1-9][0-9]*)(?:([+-])([1-9][0-9]*))?(?:(>=|<=|>|<|=)?([1-9][0-9]*))?/g;
    var match = comando.exec(data);
  
    data = rolaDado(match);
    
    var systemName = "System - " + socket.username + " rolou:";
    // we tell the client to execute 'new message'
   // socket.broadcast.emit('new message', {
   io.sockets.emit('new message', {
      username: systemName,
      message: data
    });
  });
  

socket.on('AcaoFalaPensamento', function (data) {
  
  var Mensagem = data;
  var stringLength = Mensagem.length;
  //var dentro;
  var inicio;
  var fim;
  var p; //ponteiro
  var msg = [];
  // "--Mensagem do dia"
  //--  dentro = True
  // Inicio = Mensagem[i];
  for (let i = 0; i < stringLength; i++) {
    if (Mensagem[i] == "-" && (i+1 <= stringLength && Mensagem[i+1] == "-") && (i+2 <= stringLength &&Mensagem[i+2] == "-")){
        //Grito
        //dentro = "grito";
        inicio = i;
        //CONTINUAR AQUI 
        for (let r = i+3; r < stringLength; r++){
          //encontrar fim
          //(r.next()) && 
          if (r+1 >= stringLength || (Mensagem[r] == "*" || Mensagem[r] == '"' || Mensagem[r] == "-")){
            fim = r;
            p =r;
            
            msg.push({
              "text":Mensagem.slice(inicio, fim), 
              css:{"font-weigth":"bolder"}
            });
            }
        }
      i=p; //avança o for orginal até o fim do grito para para nao repetir a iteração
      // modificar mensagem entre var inicio e var fim
    }
    
    
    
    
    if (Mensagem[i] == "-" && (i+1 <= stringLength && Mensagem[i+1] == "-")){
      //Fala
      inicio = i;
        //CONTINUAR AQUI 
        for (let r = i+2; r < stringLength; r++){
          //encontrar fim
          //(r.next()) && 
          if (r+1 >= stringLength || (Mensagem[r] == "*" || Mensagem[r] == '"' || Mensagem[r] == "-")){
            fim = r;
            p =r;
            
            msg.push({
              "text":Mensagem.slice(inicio, fim), 
              css:{}
            });
            }
        }
      i=p;
    }    
    if (Mensagem[i] == "-" ){
      //Sussuro
      inicio = i;
        //CONTINUAR AQUI 
        for (let r = i+1; r < stringLength; r++){
          //encontrar fim
          //(r.next()) && 
          if (r+1 >= stringLength || (Mensagem[r] == "*" || Mensagem[r] == '"' || Mensagem[r] == "-")){
            fim = r;
            p =r;
            
            msg.push({
              "text":Mensagem.slice(inicio, fim), 
              css:{}
            });
            }
        }
      i=p;
    }
    if (Mensagem[i] == '"'){
      //Pensamento
      inicio = i;
        //CONTINUAR AQUI 
        for (let r = i+1; r < stringLength; r++){
          //encontrar fim
          //(r.next()) && 
          if (r+1 >= stringLength || (Mensagem[r] == "*" || Mensagem[r] == '"' || Mensagem[r] == "-")){
            fim = r;
            p =r;
            
            msg.push({
              "text":Mensagem.slice(inicio, fim), 
              css:{}
            });
            }
        }
      i=p;
    }
    if (Mensagem[i] == "*"){
      //Acao
      inicio = i;
        //CONTINUAR AQUI 
        for (let r = i+1; r < stringLength; r++){
          //encontrar fim
          //(r.next()) && 
          if (r+1 >= stringLength || (Mensagem[r] == "*" || Mensagem[r] == '"' || Mensagem[r] == "-")){
            fim = r;
            p =r;
            
            msg.push({
              "text":Mensagem.slice(inicio, fim), 
              css:{}
            });
            }
        }
      i=p;
    }
    
    console.log(msg);
    
  }

  
  
  
  
  
});


function rolaDado( match){
  
  var numRolagem = ~~match[1];
  var tipo = match[2];
  var lados = ~~match[3];
  var operador = match[4];
  var numOperado = ~~match [5];
  var teste = match [6];
  var numTestado = ~~match[7];
  var numSucessos;
  var rolls =[];

//• Bark rolou 10d10 [ 6+2=8, 10+2=12, 8+2=10, 5+2=7, 7+2=9, 9+2=11, 9+2=11, 2+2=4, 9+2=11, 6+2=8 ] onde o maior resultado foi 12!
//• Bark rolou 3d4 e tirou 9
//• Bark rolou 4d4 [ 2, 2, 3, 2 ] e obteve 9
//• Bark rolou 10d10 [ 1, 8, 4, 2, 7, 8, 10, 7, 10, 5 ] onde obteve 6 sucessos acima de 6!
  
  
  var comparison = {
  "+": function(x, y) { return x + y   },
  "-": function(x, y) { return x - y   },
  
  ">": function(x, y) { return x > y   },
  "=": function(x, y) { return x == y  },
  "<": function(x, y) { return x < y   },
  "<=": function(x, y) { return x <= y },
  ">=": function(x, y) { return x >= y }
};

  for (let i=0; i < numRolagem; i++){
      // guarda numero rolado
      let roll = Math.floor(Math.random() * lados) +1;
      // some numOperado a roll se existir operador
      let soma = operador&&comparison[operador](roll, numOperado);
      // compara  roll com o numTestado se teste existir
      let compSimples = teste&&comparison[teste](roll, numTestado);
      // compara soma com num testado se teste existir
      //                                        >     2       3 (false)
      let compComplx = soma&&teste&&comparison[teste](soma, numTestado);

      // popula o mapa com todas as rolagens
      rolls[i] = {
        "roll":roll,
        "soma":soma,
        "compSimples":compSimples,
        "compComplx" :compComplx
      };
      
  }
  
  switch(tipo) {
    case "d":{
        //    2d6 [ 2, 4] = 6 + sucesso / falha
        let total = rolls.reduce((a, b) => a + b.roll, 0);
        
        
        if(operador){
         let soma =  comparison[operador](total, numOperado) ;
          
            
          if(teste){
            let comparacao = comparison[teste](soma, numTestado) ? " SUCESSO" : " FALHA";
            
            return "Rolou " + numRolagem + tipo + lados +
            " "                   + 
            operador              + 
            " "                   + 
            numOperado            +
            " "                   + 
            teste                 + 
            " "                   + 
            numTestado            + 
            " : "                 + 
            soma + teste + numTestado + 
            " " + comparacao;
             
            }
          return "Rolou " + numRolagem + tipo + lados +" " + operador + " " + numOperado +" : " + soma;
        }
        
        if (teste) {

          let comp2 = comparison[teste](total, numTestado) ? " SUCESSO" : " FALHA";
          return "Rolou " + numRolagem + tipo + lados +
          " " +
          teste +
          " " +
          numTestado +" : " + total + 
          " " +
          comp2;
        }
        return "Rolou " + numRolagem + tipo + lados +" : " + total;
    }
    break;
    case "i":{
        let total = rolls.reduce((a, b) => a + b.roll, 0);
        let numRolls="";
        
        for(let roll of rolls) {
          numRolls += "[" + roll.roll + "]";
        }
        
        if(operador){
          let soma =  comparison[operador](total, numOperado) ;
          
            
          if(teste){
            let comparacao = comparison[teste](soma, numTestado) ? " SUCESSO" : " FALHA";
            
            return "Rolou " + numRolagem + tipo + lados +
            " "                   + 
            operador              + 
            " "                   + 
            numOperado            +
            " "                   + 
            teste                 + 
            " "                   + 
            numTestado + " : " + numRolls + operador + numOperado +" : " + soma + teste + numTestado +
            " " + comparacao;
             
            }
          return "Rolou " + numRolagem + tipo + lados +" " + operador + " " + numOperado +" : " + numRolls + operador + numOperado +" : " + soma;
        }
        
        if (teste) {

          let comp2 = comparison[teste](total, numTestado) ? " SUCESSO" : " FALHA";
          return "Rolou " + numRolagem + tipo + lados +
          " " +
          teste +
          " " +
          numTestado +" : " + numRolls + " : " + total + 
          " " +
          comp2;
        }
       
        return "Rolou " + numRolagem + tipo + lados +" : " + numRolls + " : " + total;
       
    }
        break;
    case "t":{
        let total = rolls.reduce((a, b) => a + b.roll, 0);
        let numRolls="";
        
        if(operador){
          if(teste){
            let numSucesso = 0;
            for(let roll of rolls) {
              numRolls += "[" + roll.roll + operador + numOperado +": "+ roll.soma + teste + numTestado +"]";
              if (roll.compComplx === true){
                  numSucesso++;
                } 
              }
            return "Rolou " + numRolagem + tipo + lados +
            " "                   + 
            operador              + 
            " "                   + 
            numOperado            +
            " "                   + 
            teste                 + 
            " "                   + 
            numTestado + " : " + numRolls + " : " + numSucesso + " SUCESSO(S)";
            }
          for(let roll of rolls) {
            numRolls += "[" + roll.roll + operador + numOperado +": "+ roll.soma +"]";
          }  
          return "Rolou " + numRolagem + tipo + lados +" " + operador + " " + numOperado +" : " + numRolls;
        }
        
        if (teste) {
          let numSucesso = 0;
          for(let roll of rolls) {
              numRolls += "[" + roll.roll + teste + numTestado +"]";
              if (roll.compSimples === true){
                numSucesso++;
              } 
          }
          
          return "Rolou " + numRolagem + tipo + lados +
          " " +
          teste +
          " "+
          numTestado+
          " : " +numRolls +" : " + numSucesso + " SUCESSO(S)";
        }
        for(let roll of rolls) {
          numRolls += "[" + roll.roll + "]";
         }
        return "Rolou " + numRolagem + tipo + lados +" : " + numRolls;
       
    }
        break;
        
        
      
      
      
}


} 


  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;
    
    // we store the username in the socket session for this client
    if (numUsers === 0){
        
        username = Sufix(username);
        username = Prefix(username);
     }
    
    socket.emit('new username', 
        username
    );
   
    socket.username = username;
    
   
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
