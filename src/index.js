const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT;
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');
const User = require('./models/user.model');
const jwt = require('jsonwebtoken');
const Job = require('./models/job.model');


app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

app.get('/', async (req, res) => {
    const users = await User.find();
    return res.status(200).send({users});
});

//get all jobs

app.get('/jobs', async (req, res) => {
    let query = {};
    const {companyName,location,contract} = req.query;
    if(companyName) {
        query.companyName = companyName;
    }
    if(location) {
        query.location = location;
    }
    if(contract) {
        query.contract = contract;
    }


    try {
        const jobs = await Job.find(query);
        return res.status(200).send({
            jobs
        });
        
    } catch (error) {
        return res.status(400).send({
            message : 'Something went wrong',
            error : error.message
        });
        
    }
});

//post new job

app.post('/jobs', async (req, res) => {
    const {companyName, position, contract, location} = req.body;
    try {
        const job = await Job.create({
            companyName,
            position,
            contract,
            location
        });
        return res.status(201).send({
            message : 'Job created successfully',
            newJob : job
        });

    } catch (error) {
        return res.status(400).send({
            message : 'Something went wrong',
            error : error.message
        });
    }
});

//delete job

app.delete('/jobs/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const job = await Job.findByIdAndDelete(id);
        return res.status(200).send({
            message : 'Job deleted successfully',
        });

    } catch (error) {
        return res.status(400).send({
            message : 'Something went wrong',
            error : error.message
        });
    }
});

//update job

app.put('/jobs/:id', async (req, res) => {
    const {id} = req.params;
    const {companyName, position, contract, location} = req.body;
    try {
        const job = await Job.findByIdAndUpdate(id, {
            companyName,
            position,
            contract,
            location
        });
        return res.status(200).send({
            message : 'Job updated successfully',
        });

    } catch (error) {
        return res.status(400).send({
            message : 'Something went wrong',
            error : error.message
        });
    }
});

// Signup

app.post('/signup', async (req, res) => {
    const {fullname,email, password} = req.body;
    try {
        const isExist = await User.findOne({email});
        if(isExist) {
            return res.status(400).send({
                message : 'User already exist Please login'
            });
        }
        const checkEmail=email.split('@')[1];
        console.log('checkEmail: ', checkEmail);
        let role='user';
        if(checkEmail==='masaischool.com'){
            role='admin';
        }
        const user = await User.create({
            fullname,
            email,
            password ,
            role
        });
        return res.status(201).send({
            message : `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
        });

        
    } catch (error) {
        
        return res.status(400).send({
            message : 'Something went wrong',
            error : error.message
        });
    }
});

// Login

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).send({
                message : 'User not found Please signup'
            });
        }

        if(user.password !== password) {
            return res.status(400).send({
                message : 'Invalid Credentials'
            });
        }
        const token = jwt.sign({userId : user._id,
        email : user.email,
        role : user.role
        }, process.env.JWT_SECRET, {expiresIn : '7days'});
        
        
        return res.status(200).send({
            message : `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Login Successful`,
            role:user.role,
            token
        });
    } catch (error) {
        return res.status(400).send({
            message : 'Something went wrong',
            error : error.message
        });
    }
});




app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server http://localhost:${PORT} `);
});


