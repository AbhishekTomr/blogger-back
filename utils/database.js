const { MongoClient, ServerApiVersion } = require('mongodb');

let _db = null;

const mongoConnect = (callBack) => {
    const url = `mongodb+srv://AbhishekTomar:Abhishek123@cluster0.tcjciph.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(url, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
    client.connect().then(result=>{
    _db = client.db();
    console.log("connected!!!");
    // Promise.all([_db.collection('blog').deleteMany(), _db.collection('user').deleteMany()]).then(() => console.log("DELETED"))
    callBack();
    }).catch((err=>{
        console.log(err)
    }))
}

const getDb = () =>{
    if(_db)
    {
        return _db;
    }
    else{
        throw 'No DB Found !!!!';
    }
}

module.exports.mongoConnect =  mongoConnect;
module.exports.getDb = getDb;