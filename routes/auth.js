const router = require('express').Router();
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validation/Validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {

    //VALIDATION
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //CHECK EXISTING USER
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
        return res.status(400).send('Email already exists');
    }

    //HASH PASSWORD
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //CREATE A NEW USER
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });

    try {
        const savedUser = await user.save();
        res.status(201).send(`User ${req.body.name} created successfully`);
    }catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    //VALIDATION
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //CHECK EXISTING USER
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('Invalid credentials');
    }

    //CHECK PASSWORD
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send('Invalid credentials');
    }

    //CREATING AND ASSIGNING A TOKEN
    const token = await jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

})

module.exports = router;