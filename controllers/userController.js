const {body, validationResult} = require('express-validator');
const asyncHandler = require('express-async-handler');
const User = require('../models/user')
const Message = require('../models/message')
const bcrypt = require('bcryptjs');
require('dotenv').config()


exports.signup_get = asyncHandler(function(req,res,next)
{
    res.render('sign-up', {title:"Sign Up" ,});
})

exports.signup_post = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage("Name field cannot be empty")
    .escape()
    .withMessage("no"),
    body('username')
    .trim()
    .notEmpty()
    .escape()
    .withMessage("cannot contain such characters") ,
    body('password').isLength({min: 6}).withMessage("Password should be atleast 6 characters long"),
    body('confirmpassword').custom((value, {req}) => {
        return value === req.body.password
    }).withMessage("password and confirm password don't match"),

    asyncHandler(async function(req,res,next) {
        console.log(req)
        const errors = validationResult(req)
        const user = new User({
            name:req.body.name,
            username:req.body.username,
            password:req.body.password
        })
        if(!errors.isEmpty())
        {
            console.log(errors)

            res.render('sign-up', {title:"Sign Up", user:user , errors:errors});
        } else {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err)
            {
                next(err)
            } else {
                user.password = hashedPassword
                await user.save();
                res.redirect('/login')
            }
          });
        }
    })

]


exports.login_get = asyncHandler(function(req,res,next)
{
    res.render('log-in', {title: "Log In"})
})


exports.member_get = asyncHandler(function (req,res,next)
{
    res.render('member')
})


exports.member_post = [
    body("passcode").escape(),

    asyncHandler(async (req,res,next) => {
        const errors = validationResult(req)
        // const passcode = req.body.passcode
        if (!errors.isEmpty())
        {
            res.render("member", {passcode:req.body.passcode , errors:errors})
        } else {
            if (req.body.passcode === process.env.passcode)
            {
                await User.findByIdAndUpdate(req.user._id , {isMember:true})
                res.redirect("/")
            } else {
                res.render("member", {passcode: req.body.passcode, err:"Passcode Didn't match"})
            }
        }

    })
]


exports.message_create_get = asyncHandler(function(req,res,next)
{
    res.redirect('/message/new');
})


exports.new_message_get = asyncHandler(function(req,res,next){
    res.render('create-message', {title: "Create A Message"})
})


exports.new_message_post = [
    body("heading")
    .trim()
    .notEmpty()
    .escape()
    .withMessage("Cannot be empty"),
    body('text')
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Cannot Be empty"),

    asyncHandler(async (req,res,next) => {
        const errors = validationResult(req);
        const message = new Message({
            heading:req.body.heading,
            text:req.body.text,
            Author: req.user._id
        })
        if(!errors)
        {
            res.render('create-message', {title: "Create A Message", message:message })
        } else {
            await message.save()
            res.redirect('/')
        }
    })
]