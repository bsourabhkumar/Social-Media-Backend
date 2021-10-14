const router = require('express').Router()
const User = require("../models/User")



// REGISTER
router.post("/register", async (req,res) => {
    try {
        
        // create new user
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        //save user and return response
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err)
    }
})

// Login

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        !user && res.status(404).json("user not found")
        
        const validPassword = await user.password
        !validPassword && res.status(400).json("wrong password")
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router