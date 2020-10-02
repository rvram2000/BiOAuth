
var router = require('express').Router()
let generateJWT = require('./login').generateJWT

router.post('/',function(req,res,next)
    {
        
        name = req.body.name
        email = req.body.email
        //dp = req.body.img
        fd = req.body.facedesc
        redirect = req.body.redirect
        client = req.body.client
        

        emailSet = ["abc@gmail.com","def@yahoo.com"]
        if(emailSet.indexOf(email)!= -1)
        {    
            res.status(409).json({"success":"false","message":"Already Exists!"})
            
        }

        
        else
        {   
            //store request variables in DB
            //Fetch  the stored object for the user
            
            var result = {
                id : 123,
                name : "Alan Turing",
                email : "alan@cs.com",
                fd : {0:0.9888,1:0.653,2:0.2334}
            }

            result["client"] = client
            token = generateJWT(result)
            res.status(200).json({"success":"true","redirect" : redirect+token})
        }

    
    })

module.exports = router