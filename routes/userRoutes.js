const express = require('express');
const User = require('../models/User');
const sendEmail = require('../services/sendMail');
const validator = require('validator');
const router = express.Router();

router.post('/', async (req, res)=>{
    const { email } = req.body;

    if(!validator.isEmail(email)){
        return res.status(400).json({ message: 'Invalid email format' });
    }

    const existingUser = await User.findOne({ email });
    if(existingUser){
        return res.status(400).json({ message: 'User already exisists' });
    }

    const newUser = new User({ email });
    await newUser.save();

    const emailSubject = "Welcome to using the MAILGUN service";
    const emailText = "Thank you for the regisstering with us";
    const emailHtml = '<p>Thank you for <strong>registering</strong> with us!</p>';

    sendEmail(newUser.email, emailSubject, emailText, emailHtml);

    res.status(201).json({ message: 'User created successfully', user: newUser });
});

router.post('/subscribe', async (req, res)=>{
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if(!user){
            return res.status(404).json({ message: 'User does not found' });
        }
        
        if(user.isSubscribed){
            return res.status(404).json({ message: 'User is already subscribed' });
        }

        user.isSubscribed = true;
        await user.save();

        const emailSubject = "You are now subscribed to notifications!";
        const emailText = "Thank you for subscribing to our notifications.";
        const emailHtml = '<p>Thank you for <strong>subscribing</strong> to our notifications!</p>';
    
        sendEmail(user.email, emailSubject, emailText, emailHtml);

        return res.status(200).json({ message: 'User subscribed successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

router.post('/unsubscribe', async (req, res)=>{
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if(!user){
            return res.status(404).json({ message: 'User does not found' });
        }

        if(!user.isSubscribed){
            return res.status(404).json({ message: 'User is not subscribed' });
        }

        user.isSubscribed = false;
        await user.save();

        const emailSubject = "You have unsubscribed from notifications";
        const emailText = "You have successfully unsubscribed from our notifications.";
        const emailHtml = '<p>You have successfully <strong>unsubscribed</strong> from our notifications.</p>';
    
        sendEmail(user.email, emailSubject, emailText, emailHtml);

        return res.status(200).json({ message: 'User unsubscribed successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', async (req, res)=>{ 
    try {
        const user = await User.find();

        res.status(200).json( user );
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error fetching users', error: err });
    }
});

module.exports = router;