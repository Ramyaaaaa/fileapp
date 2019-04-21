'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _require = require('mongodb'),
    MongoClient = _require.MongoClient,
    ObjectID = _require.ObjectID;

var obj = new ObjectID();

var url = 'mongodb://localhost:27017/fileapp';

var connect = exports.connect = function connect(callback) {
    MongoClient.connect(url, function (err, db) {
        return callback(err, db);
    });
};
//# sourceMappingURL=database.js.map