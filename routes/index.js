const express = require('express');
const router = express.Router();
const passport = require('passport')
const userController = require('../controllers/userController')


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express'});
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

router.get('/message/new', userController.new_message_get);

router.post('/message/new', userController.new_message_post)
module.exports = router;
