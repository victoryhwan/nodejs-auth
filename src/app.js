const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
var cookie = require('cookie');
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(express.json());

app.get('/', (req, res) => {
    // res.send('Hello World!');
    res.send({
        id: "test",
        name: "test"
    })
}
);

const users = [
    {id: "test", password: "test"}
]

app.post('/login', async (req, res) => {
    const { id, password } = req.body;
    const user = users.find(user => user.id === id && user.password === password);

    console.log(user)
    if (user) {
        try {   
            const token = jwt.sign({ id, password }, process.env.JWT_SECRET, { 
                    expiresIn: '1m',
                    issuer: 'aaaaaaaa'
                });
                res.cookie("token", token);
                res.send(user);
        } catch (err) {
            console.log(err);
            return res.status(401)
        }
    }
    else {
        console.log('1111')
        res.sendStatus(401)
    }
})

app.get('/user', async (req, res) => {

    console.log("user",req.headers.cookie)
    if(req.headers.cookie){
        let cookies = cookie.parse(req.headers.cookie)
        jwt.verify (cookies.token, process.env.JWT_SECRET, (err, decoded)=>{
            if(err){
                console.log(1)
                return res.status(402)
            }
            console.log(2)
            return res.send(decoded)
        })
    }else{
        console.log(3)
        return res.sendStatus(401)
    }
})

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
})