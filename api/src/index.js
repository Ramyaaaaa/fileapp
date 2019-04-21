
import {connect} from "./database";
import AppRouter from "./router";
import multer from 'multer';
const http = require('http')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const PORT = 3000;
const app = express();
import path from 'path'
import AWS from 'aws-sdk'

import nodemailer from 'nodemailer'
import smtp from "./config"
import multerS3 from 'multer-s3'

app.server = http.createServer(app);
var smtpTransport = require('nodemailer-smtp-transport');

//amazon s3 setup
AWS.config.update({
    accessKeyId : 'AKIAZ2LYBQU7B6A5XBZV',
    secretAccessKey : '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'
});

AWS.config.region = 'us-east-1'

//Setup email

//File storage config
const storageDir = path.join(__dirname,'..','storage')
var storageConfig = multer.diskStorage({
    destination:  (req, file, cb) =>{
      cb(null, storageDir)
    },
    filename:  (req, file, cb) =>{
      cb(null, Date.now()+ path.extname(file.originalname))
    }
  });

//const upload = multer({storage:storageConfig})
  
const s3 = new AWS.S3();
const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'ramyafileapp',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, `${Date.now().toString()}-${file.originalname}`)
      }
    })
  })

//End of file storage config
app.use(morgan('dev'));
console.log("HO000");

app.use(cors({
    exposedHeaders: "*"
}));

app.use(bodyParser.json({
    limit: '50mb'
}));
app.set('root', __dirname);
app.set('storageDir',storageDir);
app.upload = upload;
app.s3= s3;
// app.email = email;
//Connect to db
connect((err,db)=>{
    
    if(err) {
        console.log("An error connecting to database");
        throw (err);
    }

    app.set('db',db);



    //init router
    new AppRouter(app);
    app.server.listen(process.env.PORT || PORT, () => {
        console.log(`App is running on port ${app.server.address().port}`);
    });
})

export default app;