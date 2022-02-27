var express = require('express');
var router = express.Router();
const {mongodb,MongoClient,dbName,dbURL} = require('../dbConfig');
const {hashing,hashCompare,role,adminrole,createJWT,authentication} = require('../library/auth')

// Add new income
router.post('/income',async (req,res)=>{
  const client = await MongoClient.connect(dbURL);
  try {
    const db = await client.db(dbName);    
    let user = await db.collection('users').findOne({_id:mongodb.ObjectId(req.body.user)})    
    req.body.userId = req.body.user.toString();
    req.body.date = new Date(req.body.date);
    const income = await db.collection('income').insertOne(req.body);
    const total = await db.collection('Total Amount').findOne({user:req.body.user});       
    let param = {
      user : req.body.user.toString(),
      income : parseInt(req.body.income)
    }
    if(total){      
      param.income += total.income;      
     await db.collection('Total Amount').findOneAndUpdate({_id:mongodb.ObjectId(total._id)}, {$set:{income: param.income}});          
    }
    else{
      
      await db.collection('Total Amount').insertOne(param);        
      
    }    
    res.json({
      message:"Inserted successfully",
      status:200
    });
  } catch (error) {    
    res.json({
      message:"Error Occurred",
      status:400
    })
  }  
});


// Add new expense
router.post('/expense',async (req,res)=>{
  const client = await MongoClient.connect(dbURL);
  try {
    const db = await client.db(dbName);    
    let user = await db.collection('income').findOne({userId:req.body.user})
    let totalIncome = await db.collection('Total Amount').findOne({user:req.body.user})
    req.body.date = new Date(req.body.date);    
    if(user){      
      let income = totalIncome.income - req.body.expense;
      const exp = await db.collection('expense').insertOne(req.body);
      await db.collection('Total Amount').findOneAndUpdate({_id:mongodb.ObjectId(totalIncome._id)}, {$set:{income: income}});
    }    
    res.json({
      message:"Inserted successfully",
      status:200
    });
  } catch (error) {    
    res.json({
      message:"Error Occurred",
      status:400
    })
  }  
});


router.post('/register',async(req,res)=>{
  const client = await MongoClient.connect(dbURL)
  try{
   const db = await client.db(dbName);
   let user = await db.collection('users').findOne({email:req.body.email})
   if(user)
   {
    res.json({
      status:202,
      message:"User already exists"
    })
  }
  else{
    const hash = await hashing(req.body.password);    
    req.body.password = hash;
    let account = {
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      email:req.body.email,
      password:hash      
    }
    let document = await db.collection('users').insertOne(account);
    const token = await createJWT({email:req.body.email})    
    res.json({
      status:200,
      message:'Account Created',
      emailVerifyToken:token
    })
  }
  }
  catch(error)
  {    
     res.send(error)
  }
  finally{
    client.close();
  }
})

// Login

router.post('/login',async(req,res)=>{
  const client = await MongoClient.connect(dbURL)
  try{
    const db = await client.db(dbName);
    let user = await db.collection('users').findOne({email:req.body.email})
    if(user)
    {
      const compare = await hashCompare(req.body.password,user.password);
      if(compare===true)
      {
        const token = await createJWT({email:req.body.email})
        res.json({
          status:200,
          message:'Login Successfull',
          userId:user._id
        })
      }
      else{
        res.json({
          status:202,
          message:'Wrong password'
        })
      }
    }else{
      res.json({
        status:404,
        message:'User does not exist/Account Not Activated'
      })
    }
  }
  catch(error)
  {
     res.send(error)
  }
  finally{
    client.close();
  }
})


// get expenses and income
router.post('/get-exp-inc/',async (req,res)=>{
  const client = await MongoClient.connect(dbURL);
  try {    
    const db = await client.db(dbName);
    const total = await db.collection('expense').find({$and:[{
      user:req.body.user
    },
    {date:{$gte:new Date(req.body.fromDate),$lte:new Date(req.body.toDate)}}
]}).toArray();
    res.json({
      message:"feched successfully",
      data: total,
      status:200
    });
  } catch (error) {    
    res.json({
      message:"Error Occurred",
      status:400
    })
  }  
});



// get expenses
router.post('/get-data',async (req,res)=>{
  const client = await MongoClient.connect(dbURL);
  try {    
    const db = await client.db(dbName);
    const data = await db.collection('expense').find({user:req.body.user}).toArray();    
    res.json({
      message:"feched successfully",
      data: data,
      status:200
    });
  } catch (error) {    
    res.json({
      message:"Error Occurred",
      status:400
    })
  }  
});




module.exports = router;
