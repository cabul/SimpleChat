window.onload = function(){
  var sip = document.getElementById('sip').innerHTML
    , sport = document.getElementById('sport').innerHTML
    , user = document.getElementById('user').innerHTML
    , field = document.getElementById('field')
    , send = document.getElementById('send')
    , msg = document.getElementById('messages')
    , messages = []
    , socket = io.connect('http://'+sip+':'+sport);

  console.log('Connected to '+sip+':'+sport);

  socket.on('message', function(data) {
    if(!data.message) {
      console.log('IOError: ', data);
      return;
    }
    messages.push(data);
    var html = '';
    for( var i in messages ){
      if(messages[i].user)
        html += '<p><b>'+messages[i].user+':</b> '+messages[i].message+'</p>';
      else
        html += '<p><i>'+messages[i].message+'</i></p>';
    }
    msg.innerHTML = html;

  });

  send.onclick = function(){
    socket.emit('send',{ message: field.value, user: user});
    field.value = '';
  };

  field.onkeyup = function(ev){
    if(ev.keyCode === 13){
      send.click();
    }
  };
  
  window.onunload = function(){
    socket.emit('send', { message: user+' se ha desconectado'});
  }

}
