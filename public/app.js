var express = require('express')
  , app = express()
  , port = 3000;

ifconfig(start);

function start(ip,e){
if(e){
  console.log(e);
  return;
}
app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'jade' );
app.engine( 'jade', require('jade').__express);

app.use( app.router );
app.use( express.logger( 'dev' ));
app.use( express.static( __dirname + '/public' ));

app.get('/', function( req, res ){
  res.render('index', {
    title: 'Hola Mundo'
  });
});

var io = require('socket.io').listen(app.listen(port));
io.set('log level',1);

app.get('/user/:user', function( req, res ){
  var user = req.params.user;
  console.log( 'User connected: ' + user );
  io.sockets.emit('message', {message: user+' se ha conectado'})
  res.render( 'chat', {
    title: 'Ejemplo de Chat'
  , user: user
  , sip: ip
  , sport: port
  }); 
});

console.log('Listening on '+ip+':'+port);

io.sockets.on('connection', function(socket) {
  socket.emit('message', { message: 'Bienvenido al chat' });
  socket.on('send', function(data) {
    io.sockets.emit('message',data);
  });
});

}

function ifconfig(callback) {
  var socket = require('net').createConnection(80, 'www.google.com');
  socket.on('connect', function(){
    callback(socket.address().address);
  });
  socket.on('error', function(e){
    callback(undefined,e);
  });
}

