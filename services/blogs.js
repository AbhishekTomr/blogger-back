const database = require('../utils/database');
const userServices = require('./user');
const LikesModule = require('../models/likes')
const BlogModel = require('../models/blogs');
const CommentsModule = require('../models/comments');

const addBlog = (blogData,callBackFn,response) => {
        const db = database.getDb();
        const blogObj = new BlogModel.Blog(blogData.author,blogData.title,blogData.body,blogData.created_ts,blogData.updated_ts,blogData.likes,blogData.comments);
        blogObj.createBlog(db,callBackFn,response);
}

const deleteBlog = async (blogId,callBackFn,response) => {
        const db = database.getDb();
        const blog =  await db.collection('blog').find({'_id':blogId}).next();
        if(blog) {
                const { author } = blog;
                const [_userResp, blogResp] = await Promise.all([
                        userServices.deleteBlogFromUser(author,blogId),
                        db.collection('blog').deleteOne({'_id':blogId})
                ]);
                callBackFn(response,{status:true,message:"Blog Deleted !!!",data:blogResp})
        }
}

const updateBlog = (updatedBlog,callBackFn,response) => {
        const db = database.getDb();
        db.collection('blog').updateOne({_id:updatedBlog._id},{$set:updatedBlog}).then(res=>callBackFn(response,{status:true,message:"Blog Updated !!!",data:res}))
        .catch(err=>callBack(response,{status:false,message:"Error in updating blog !!!",data:err}));
}

const addComment = (commentData,callBack,response) => {
        const commentObj = new CommentsModule.Comment(commentData.id,commentData.blogId,commentData.author,commentData.message);
        const db = database.getDb();
        commentObj.addComment(db,callBack,response);
}

const deleteComment = (comment,callBack,response) => {
        const db = database.getDb();
        console.log('commment recived',comment);
        db.collection('blog').updateOne({_id:comment.blogId},{ $pull: { comments: {id: comment.id} } }).then(res=>{
                callBack(response,{status:true,message:"comment deleted",data:res});
        }).catch(err=>callBack(response,{status:false,message:"Error in updating blog !!!",data:err}))
}

const like = (like,callBack,response) =>{
        const likeObj = new LikesModule.Likes(like.id,like.blogId,like.author);
        const db = database.getDb();
        likeObj.addLike(db,callBack,response);
}

const unlike = (like,callBack,response) => {
        const db = database.getDb();
        db.collection('blog').updateOne({_id:like.blogId},{ $pull: { likes: {id: like.id} } }).then(res=>{
                callBack(response,{status:true,message:"Unliked the blog",data:res});
        }).catch(err=>callBack(response,{status:false,message:"Error in unliking the blog!!!",data:err}))
}

const viewAllBlogs = (callBack,response) => {
        const db = database.getDb();
        db.collection('blog').find().toArray().then(blogs=>{
        callBack(response,{status:true,message:"all blogs",data: blogs})
}).catch(err=>callBack(response,{status:true,message:"all blogs",data: err}));
}

const viewMyBlogs = (userId,callBackFn,response) => {
        const db = database.getDb();
        db.collection('user').find({_id:userId}).next().then(user=>{ 
                return user.email;
            }).then(email=>{
                db.collection('blog').find({author:email}).toArray().then(blogs=>{
                    callBackFn(response,{status:true,message:"user",data:blogs});
                }) 
            }).catch(e=>{
                callBackFn(response,{status:false,message:"unable to fetch user record",data:null});
            })
}

module.exports.addBlog = addBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.updateBlog = updateBlog;
module.exports.viewAllBlogs = viewAllBlogs;
module.exports.viewMyBlogs = viewMyBlogs;
module.exports.addComment = addComment;
module.exports.deleteComment = deleteComment;
module.exports.like = like;
module.exports.unlike = unlike;
