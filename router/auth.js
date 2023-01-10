const { json } = require('express');
const express = require('express');
const User = require('../model/userSchema');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = 'LeonChandler123'

// create a user
router.post('/signup',[
    body('name', 'Enter a valid name').isLength({min:3}),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters in length').isLength({ min: 5 }),
], async (req,res)=> {
   

    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

// check whether the user with this email already exists
    try{
        let user = await User.findOne({email: req.body.email});
        if(user) {
            return res.status(400).json({ error: " A user with this email already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password, salt); 

        // Create a new User
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email:req.body.email,
        })
        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        // console.log(jwtData);

        res.json({authtoken})

    } catch( error) {
        console.log(error.message);
        res.status(500).send('Some error occured')
    }
});

// login 

router.post('/login',[
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password can not be blank').isLength({ min: 5 }),
], async (req,res)=> {
    let success = false
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;

    try{
        let user = await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({error: "Please try to login with correct credentials"});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if(!passwordCompare){
            return res.status(400).json({error: "Please try to login with correct credentials"});
        }
        const data = {
            user:{
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true
        res.send({ success,authtoken} );
    } catch(error) {
        console.log(error.message);
        res.status(500).send('Internal Server error')
    }
});


// get logged in user details using POST. Login Required
router.post('/getuser', fetchuser, async(req,res)=>{
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch(error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error"); 
    }})

module.exports = router;