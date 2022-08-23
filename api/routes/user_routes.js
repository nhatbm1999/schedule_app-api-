const express = require('express');
const { route } = require('express/lib/application');
const { token } = require('morgan');
const router = express.Router();
const auth = require('../middlewares/auth');

const UserController = require('../controllers/user_controller');
const check_token = require('../middlewares/check_token');
const {checkTokenAdmin} = require('../middlewares/check_authentication');
const {checkToken} = require('../middlewares/check_token');

router.post('/register', UserController.Register);
router.post('/login',UserController.Login);
router.patch('/updateInfo', UserController.Update);
router.put('/registerEvent', UserController.registerEvent);
router.put('/unregisterEvent', UserController.unregisterEvent);
router.get('/auth/me', checkToken, async(req, res) => {
    //res.send(req.user)
    res.json({
        _id: req.user.id,
        email: req.user.email,
        username: req.user.username,
        avatar: req.user.avatar == null ? '' : req.user.avatar,
        phone: req.user.phone == null ? '' : req.user.phone,
        registeredEvents: req.user.registeredEvents
    })
})
router.post('/auth/refresh', UserController.Refresh);
router.get('/user', UserController.getUserInfo);

module.exports = router;