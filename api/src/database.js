const {MongoClient,ObjectID} = require('mongodb');
var obj = new ObjectID();

const url = 'mongodb://localhost:27017/fileapp';

export const connect = (callback) =>{ 
    MongoClient.connect(url,(err,db)=>{
        return callback(err,db);
    });
}
