const express = require('express');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const cors = require('cors');
const expressjwt = require("express-jwt");

const app = express();
const PORT = 8000 || process.env.PORT
const users = [
    { id: 1 , username : "admin" , password: "admin"},
    { id: 1 , username : "guest" , password: "guest"},
]

app.use(cors());
app.use(bodyParser.json())

const jwtCheck = expressjwt({
    secret: "mysupersecretkey",
    algorithms: ['HS256']
});

app.get("/resource" , (req, res) =>{
    res
        .status(200)
        .send("Public resouce, you can see this")
})

app.get("/resouce/secret" , jwtCheck, (req, res) =>{
    res
        .status(200)
        .send("Secret")
})

app.post("/login" , (req, res) =>{
    const {username, password} = req.body;

    if(!username || ! password){
        res
            .status(401)
            .send("Some fields are empty")
        return
    }
    const user = users.find( (u) =>{
        return u.username === username && u.password === password
    })
    if(!user){
        res
            .status(401)
            .send("User nor found")
        return
    }
    const token = jwt.sign({
        sub: user.id,
        username : user.username
    }, "mysupersecretkey", {expiresIn: "3 hours"})
    res
        .status(200)
        .send({access_token : token})
})
app.get("/status" , (req, res) =>{
    const localTime = (new Date()).toLocaleTimeString();
    res
        .status(200)
        .send(`Server time is ${localTime}`)
})

app.get("*" , (req, res) =>{
    res.sendStatus(404)
})

app.listen(PORT , () =>{
    console.log(`Server is running on port ${PORT}`);
})