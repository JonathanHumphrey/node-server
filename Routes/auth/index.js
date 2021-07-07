const router = require('express').Router();
const bcrypt = require('bcrypt');
const { update, filterBy, findByEmail, sendEmail, register, findByUsername } = require('../../models/user-model');
const jwt = require('jsonwebtoken')

const resetSecret = process.env.RESET_SECRET

router.post("/register", async (req, res, next) => {
    try {
        const {
            email,
        } = req.body;
        const user = await findByEmail({ email });

        if (user) {

            res
                .status(409)
                .json({
                    message:
                        "There is an account associated with this email, please try logging in.",
                });
        } else {
            await register(req.body);
            let userData = { ...req.body };
            req.session.user = userData;
            delete userData.password;
            delete userData.email;
            res.status(200).json(userData);
            return userData;
        }
    } catch (err) {
        next(err);
    }
}); //Register new User

router.post('/login', async (req, res, next) => {
    try {
        const { username, password, remember } = req.body;

        const user = await findByUsername({ username });
        const passwordValid = await bcrypt.compare(password, user.password);

        if (user && passwordValid) {
            req.session.user = user;

            delete user.password
            delete user.email

            if (remember) {
                req.session.cookie.maxAge = 2628000000;
            }
            console.log(req.session.cookie.maxAge)
            res.status(200).json(user);
        } else {
            res
                .status(404)
                .json({ message: 'The Email/Password you provided is wrong' });
        }
    } catch (err) {
        try {
            const { email, password } = req.body;

            const user = await findByEmail({ email });
            const passwordValid = await bcrypt.compare(password, user.password);

            if (user && passwordValid) {
                req.session.user = user;

                delete user.password;
                delete user.email;

                if (remember) {
                    req.session.cookie.maxAge = 2628000000;
                }
                console.log(req.session.cookie.maxAge)
                res.status(200).json(user);
            } else {
                res
                    .status(404)
                    .json({ message: 'Email and/or Password are invalid' })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Something went wrong. Try Again.' })
        }
    }
})
module.exports = router;