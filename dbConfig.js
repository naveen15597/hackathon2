const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const dbName = 'MoneyManager';
const dbURL = `mongodb+srv://naveen:admin@naveen.uuxsj.mongodb.net/${dbName}`

module.exports = {mongodb,MongoClient,dbName,dbURL}