const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");


// create a post 
router.post("/", async (req, res)=>{
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }catch(err){
        res.status(500).json(err);
    }
});

// update a post
router.put("/:id", async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId ){
            await post.updateOne({$set:req.body})
            res.status(200).json("the post has been updated")
        }else{
            res.status(403).json("you can update only your post")
        }

    } catch (err) {
        res.status(500).json(err)
    }
})

// delete a post 

router.delete("/:id", async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        const postOwner = post.userId;
        const user = req.body.userId
        // if (postOwner === user ){
             await post.deleteOne();
            res.status(200).json("the post has been deleted");
        // }else{
            // res.status(403).json("you can delete only your post");
        // }
    } catch (err) {
        res.status(500).json(err);
    }
})

// like/unlike a post 

router.put("/:id/like", async (req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push: {likes: req.body.userId}});
            res.status(200).json("The post has been liked")
        }else{
            await post.updateOne({$pull:{likes: req.body.userId}});
            res.status(200).json("The post has been unliked")
            }
    }catch(err){
        res.status(500).json(err)
    }
});

// get a post 
router.get("/:id", async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
        res.status(500).json(err);
    }
});

// get timeline posts
router.get("/timeline/:userId", async (req, res) => {
    let postArray = [];
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId)=>{
                return Post.find({userId: friendId});
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        res.status(500).json(err);
    }
})

// get user's all posts
router.get("/profile/:username", async (req, res) => {
    let postArray = [];
    try {
        const user = await User.findOne({username: req.params.username})
        const posts = await Post.find({ userId: user._id });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
})
// get images from cloudinary
router.get('/', async (req, res) => {
    const { resources } = await cloudinary.search
        .expression('folder:socialgen')
        .sort_by('public_id', 'desc')
        .max_results(30)
        .execute();

    const publicIds = resources.map((file) => file.public_id);
    res.send(publicIds);
});

// post images to cloudinary 
router.post('/', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'socialgen',
        });
        console.log(uploadResponse);
        res.json({ msg: 'yeah' });
    } catch (err) {
        console.error(err);
        res.status(500).json('Something went wrong');
    }
});


module.exports = router ;