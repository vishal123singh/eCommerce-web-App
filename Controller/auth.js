const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User} = require('../models');
// need to put process.env.JWT_SECRET_KEY in static format

async function signUp(req,res){

    let{username,email,password}= req.body;
    const password1 = bcrypt.hashSync(password,8);
    password=password1;

    console.log('password',password);

    try{

        const user = await User.create({username,email,password});
        console.log('user',user);

        if(req.body.roles){
            const roles = req.body.roles;
            const result = await user.setRoles(roles);
            console.log('user defined roles',result);
        }
        else{
            const result = await user.setRoles([1]);
            console.log('default roles',result);
        }

        res.send({msg : "User has been created successfully"});
    }
    catch(err){
        res.status(500).send({msg: "Internal server error"});
    }
};

async function signIn(req,res){

    const username = req.body.username;
    const password = req.body.password;

    try{
        const user = await User.findOne({
            where: {
                username: username
            }
        })
        if(user){
            const validPassword = bcrypt.compareSync(password,user.password);
            if(!validPassword){
                res.status(400).send({msg: 'Username/Password is not correct'});
            }

            const token = jwt.sign({id: user.id},'lock n key' ,{
                expiresIn:'1h'
            })

            const authorities = [];
            const roles = await user.getRoles();
            for(let i=0; i<roles.length; i++){
                authorities.push(roles[i].name)
            }

            const finalUser = {
                id: user.id,
                name: user.username,
                email: user.email,
                token: token,
                authorities: authorities
            }

            res.send(finalUser);
        }
        else{
            res.status(400).send({msg: 'Username/Password is not correct'});
        }
    }
    catch(err){
        res.status(500).send({msg: 'Internal server error',err})
    }
}


module.exports = {signUp,signIn};
