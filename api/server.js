var express = require('express');
var app = express();
var port = process.env.PORT || 8006
// app.use(express.static(__dirname));
const path = require('path');

const ind = require('./src/index.js');

app.use('/',ind);
// app.get('/', function (req, res) {
//   res.send('index'); // This will serve your request to '/'.
// });


if(process.env.NODE_END === 'production') {
  app.use(express.static('app/build'));

  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'app','build','index.html'))

  })
}

app.listen(port, function () {
  console.log('Example app listening on port 8000!');
 });