const express = require('express');
const router = express.Router();
const Message = require('../models/message')
const passport = require('passport')
const userController = require('../controllers/userController')


/* GET home page. */
router.get('/', async function (req, res, next) {
  const allMessages = await Message.find({}).populate("Author").sort({date:-1}).exec()
  res.render('index', { title: 'Express', allMessages:allMessages});
});

router.get('/signup', userController.signup_get);

router.post('/signup', userController.signup_post);

router.get('/login', userController.login_get);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

router.get('/logout', (req,res,next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
})


router.get('/member' , userController.member_get)
router.post('/member', userController.member_post)

router.get('/message/new', userController.new_message_get);

router.post('/message/new', userController.new_message_post)
module.exports = router;
