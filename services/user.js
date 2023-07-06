var UserModel = require("../models/user");
const database = require('../utils/database');

 
const signUp = (userData,callBackFn,response) => {
    const db = database.getDb();
    db.collection('user').find({email:userData.email}).next().then(data=>{
        if(data)
        {
            callBackFn(response,{status: false, message: "User Already Exist !!!", data: null});
        }else{
            const user = new UserModel.User(userData.firstName,userData.lastName,userData.email,userData.password,userData.blogs);
            user.signUp(db,callBackFn,response);
        }
    }).catch(e=>{
        callBackFn(response,{status: false, message: "Error in adding the user !!!", data: null});
    }
);
}

const signIn = (userData,callBackFn,response) => {
    const db = database.getDb();
    db.collection('user').find({email:userData.email}).next().then(async (data)=>{
        if(userData.password===data.password)
        {
            callBackFn(response,{status: true,message: "Signed In Successfull!!!",data: data});
            return;
        }
        callBackFn(response,{status:false,message:"incorrect password",data:null})
    }).catch(e=>callBackFn(response,{status: false, message: 'account not found !!!',data:null}));
}

const pushBlogToUser = (email,blogId) => {
    const db = database.getDb();    
    db.collection('user').updateOne({email:email},{ $push: { blogs: blogId } }).then(res=>{
        console.log("user updated");
    })
}

const deleteBlogFromUser = (email,blogId) =>{
    const db = database.getDb();    
    db.collection('user').updateOne({email:email},{ $pull: { blogs: blogId } }).then(res=>{
        console.log("user updated");
    })
}

const generateUpdatedUser = (userid,callBackFn,response) =>{
    let userData = {};
    const db = database.getDb();
    db.collection('user').find({_id:userid}).next().then(user=>{ 
        userData = {_id:user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, blogs: user.blogs}; 
        return userData;
    }).then(user=>{
        db.collection('blog').find({author:user.email}).toArray().then(blogs=>{
            user.blogs = [...blogs];
            callBackFn(response,{status:true,message:"user",data:user});
        }) 
    }).catch(e=>{
        callBackFn(response,{status:false,message:"unable to fetch user record",data:null});
    })
}

    

module.exports.signIn = signIn;
module.exports.signUp = signUp;
module.exports.pushBlogToUser = pushBlogToUser;
module.exports.deleteBlogFromUser = deleteBlogFromUser;
module.exports.generateUpdatedUser = generateUpdatedUser;