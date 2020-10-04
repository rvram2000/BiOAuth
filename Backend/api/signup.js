
var router = require('express').Router()
const fs = require('fs')
let generateJWT = require('./login').generateJWT

router.post('/',function(req,res,next)
    {
        
        name = req.body.name
        email = req.body.email
        fd = req.body.facedesc
        client = req.body.client
        redirect = "thirdparty.com?token="
        console.log(name)
        console.log(email)
        console.log(fd)
        //dp = req.body.img
        //redirect = req.body.redirect
        
        
        

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
                name : name,
                email : email,
                fd : fd
            }
            fs.writeFileSync('Backend/api/fd.json',JSON.stringify(result))

            result["client"] = client
            token = generateJWT(result)
            res.status(200).json({"success":"true","redirect" : redirect+token})
        }

    
    })

module.exports = router