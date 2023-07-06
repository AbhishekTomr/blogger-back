const MongoClient = require('./utils/database');
const express = require('express');
const userServices = require('./services/user');
const blogServices = require('./services/blogs');
const cors = require('cors');
const mongoDB = require('mongodb');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

const sendResponse = (res,{status,message,data})=>{
    if(status){
        res.status(200).json({status, message, data})
    }
    else{
        res.json({status, message, data});
    }
}

//for all the api response obj {status: true/false, message:'', data:''}

app.use(cors());

// app.use(express.urlencoded({extended:false}));
app.use(express.json({extended:false}));

app.post('/api/v1/sign-up',(req,res,next)=>{
    //signs up a user and sends a response message.
    const userData = req.body;
    userServices.signUp(userData,sendResponse,res); 
})

app.post('/api/v1/sign-in',(req,res,next)=>{
    //sign in and sends back an aggrefated user data.
    const userData = req.body;
    userServices.signIn(userData,sendResponse,res);
})

app.post('/api/v1/blogs/add',(req,res,next)=>{
    //gets a blog data, adds a blog and send back and aggregated User data.
    const blogData = req.body;
    blogServices.addBlog(blogData,sendResponse,res); 
})

app.post('/api/v1/blogs/delete',(req,res,next)=>{
    //gets an id remove the record, send back an updated User aggregated Object
    //logic for poping the id form user Blog
    const blogId = new mongoDB.ObjectId(req.body._id);
    blogServices.deleteBlog(blogId,sendResponse,res);
})

app.post('/api/v1/blogs/update',(req,res,next)=>{
    const updatedBlog = {...req.body,_id: new mongoDB.ObjectId(req.body._id)};
    blogServices.updateBlog(updatedBlog,sendResponse,res);
    //gets an id update the record, send back an updated User aggregated Object 
})

//comments

app.post('/api/v1/comment/add',(req,res,next)=>{
    //gets a blog data, adds a blog and send back and aggregated User data.
    let commentData = {...req.body,blogId: new mongoDB.ObjectId(req.body.blogId)};
    blogServices.addComment(commentData,sendResponse,res); 
})

app.post('/api/v1/comment/delete',(req,res,next)=>{
    //gets an id remove the record, send back an updated User aggregated Object
    //logic for poping the id form user Blog
    const comment = {...req.body, blogId: new mongoDB.ObjectId(req.body.blogId)};
    blogServices.deleteComment(comment,sendResponse,res);
})

//likes
app.post('/api/v1/like/add',(req,res,next)=>{
    //gets a blog data, adds a blog and send back and aggregated User data.
    let likeData = {...req.body,blogId: new mongoDB.ObjectId(req.body.blogId)};
    blogServices.like(likeData,sendResponse,res); 
})

app.post('/api/v1/like/delete',(req,res,next)=>{
    //gets an id remove the record, send back an updated User aggregated Object
    //logic for poping the id form user Blog
    let likeData = {...req.body,blogId: new mongoDB.ObjectId(req.body.blogId)};
    blogServices.unlike(likeData,sendResponse,res); 
}) 

app.get('/api/v1/getUser/:userId',(req,res,next)=>{
    const userId = new mongoDB.ObjectId(req.params.userId);
    userServices.generateUpdatedUser(userId,sendResponse,res);
    //gets an id update the record, send back an updated User aggregated Object 
})

//getBlogs
app.get('/api/v1/allblogs',(req,res,next)=>{
    blogServices.viewAllBlogs(sendResponse,res);
}) 
app.get('/api/v1/myblogs/:userId',(req,res,next)=>{
    const userId = new mongoDB.ObjectId(req.params.userId);
    blogServices.viewMyBlogs(userId,sendResponse,res);
})
app.get('/api/v1/myprofile/:userId',(req,res,next)=>{
 
})

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Express API with Swagger",
        version: "0.1.0",
        description:
          "This is a simple CRUD API application made with Express and documented with Swagger for Blog Management",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
      },
      servers: [
        {
          url: "http://localhost:5000",
        },
      ],
    },
    apis: []
  };
  
  const specs = swaggerJsdoc(options);
  app.use(
    "/explorer",
    swaggerUi.serve,
    swaggerUi.setup(specs)
  );


MongoClient.mongoConnect(()=>{
    app.listen(5000);
});