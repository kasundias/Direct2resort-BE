const db = require('../models');

class TestUser {
    async testService(req, res) {   
        
        const users = await db.TestUser.findAll();
         console.log(users); 
        return res.status(200).send({msg: 'Test Service'});
    }

    async dropTable(req, res) {  
        await db.Post.drop(); 
        await db.TestUser.drop();
        console.log("User table dropped!"); 
    }

    async createUser(req, res) {   
        
        const jane = await db.Product.findAll();
         console.log(jane); 
        return res.status(200).send({msg: 'Test Service'});
    }

}
module.exports = TestUser;
