const {Categories} = require('../models') ;


async function checkNameForProduct(req,res,next){
    const body = req.body;

    if(body.name){
        if(body.CategoryId){
            const result = await Categories.findByPk(body.CategoryId )
            if(result){
                next();
            }
            else{
                res.status(400).send({msg: 'This Id does not exist'});
            }
        }
        else{
            res.status(400).send({msg: 'Id is required'});
        }

    }
    else{
        res.status(400).send({msg : 'Name is compulsory'});
    }
}

module.exports = {checkNameForProduct} ;