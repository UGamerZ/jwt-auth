const Router = require('express').Router;
const controller = require('../controllers/user-controller');
const { body } = require('express-validator');
const authCheck = require('../middlewares/authCheck');

const router = new Router();

router.get('/activate/:link', controller.activation);
router.get('/refresh', controller.refresh);
router.get('/users', authCheck, controller.users);

router.post('/register',
    body('email').isEmail(),
    body('password').isLength({ min: 8, max: 32 }),
    controller.registration
);
router.post('/login', controller.login);
router.post('/logout', controller.logout);

module.exports = router;