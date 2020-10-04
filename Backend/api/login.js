var router = require('express').Router()
const fs = require('fs')
var jwt = require('jsonwebtoken')
const faceapi = require("face-api.js")


function verifyFace(fd1, fd2)
{   
    fd1Array = fd1.descriptors[0]
    fd2Array = fd2.descriptors[0]
    

    const threshold = 0.40
    console.log(fd1Array)
    

    if(faceapi.euclideanDistance(fd1Array,fd2Array) <= threshold)
        return true
    else
        return false
}

function generateJWT(payload)
{
    
    //console.log(payload)
    var secret = fs.readFileSync('Backend/api/private.pem','utf-8')
    var token = jwt.sign(payload, secret, { expiresIn : '3 days' })
    return token
}
router.post('/',function(req,res,next)
    {
        
        //redirect = req.body.redirect
        redirect = "thirdparty.com?token="
        fd = req.body.facedesc
        client = req.body.client
        

        //Represents a cursor object
        //Make sure to convert the cursor object to json
        // var result = {
        //     id : 123,
        //     name : "Ram",
        //     email : "rvram2000@gmail.com",
        //     fd : fd
        //  }

        var result = fs.readFileSync('Backend/api/fd.json')
        result = JSON.parse(result)
        
         if(verifyFace(result.fd, fd))
         {
            result["client"] = client
            token = generateJWT(result)
            res.status(200).json({"verified":"true","redirect" : redirect+token})
         }
         else
         {
            res.status(401).json({"verified":"false"})
         }
         
         //console.log(req.body.redirect)
    })

module.exports = { router : router, generateJWT : generateJWT }

 