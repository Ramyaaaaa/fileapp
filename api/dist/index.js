"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _database = require("./database");

var _router = require("./router");

var _router2 = _interopRequireDefault(_router);

var _multer = require("multer");

var _multer2 = _interopRequireDefault(_multer);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _nodemailer = require("nodemailer");

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _multerS = require("multer-s3");

var _multerS2 = _interopRequireDefault(_multerS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var http = require('http');
var express = require('express');
var morgan = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
var PORT = 3000;
var app = express();


app.server = http.createServer(app);
var smtpTransport = require('nodemailer-smtp-transport');

//amazon s3 setup
_awsSdk2.default.config.update({
    accessKeyId: 'AKIAZ2LYBQU7B6A5XBZV',
    secretAccessKey: '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'
});

_awsSdk2.default.config.region = 'us-east-1';

//Setup email

//File storage config
var storageDir = _path2.default.join(__dirname, '..', 'storage');
var storageConfig = _multer2.default.diskStorage({
    destination: function destination(req, file, cb) {
        cb(null, storageDir);
    },
    filename: function filename(req, file, cb) {
        cb(null, Date.now() + _path2.default.extname(file.originalname));
    }
});

//const upload = multer({storage:storageConfig})

var s3 = new _awsSdk2.default.S3();
var upload = (0, _multer2.default)({
    storage: (0, _multerS2.default)({
        s3: s3,
        bucket: 'ramyafileapp',
        metadata: function metadata(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function key(req, file, cb) {
            cb(null, Date.now().toString() + "-" + file.originalname);
        }
    })
});

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
app.set('storageDir', storageDir);
app.upload = upload;
app.s3 = s3;
// app.email = email;
//Connect to db
(0, _database.connect)(function (err, db) {

    if (err) {
        console.log("An error connecting to database");
        throw err;
    }

    app.set('db', db);

    //init router
    new _router2.default(app);
    app.server.listen(process.env.PORT || PORT, function () {
        console.log("App is running on port " + app.server.address().port);
    });
});

exports.default = app;
//# sourceMappingURL=index.js.map