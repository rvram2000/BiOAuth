var router = require('express').Router()
const fs = require('fs')
var jwt = require('jsonwebtoken')
const faceapi = require("face-api.js")


function verifyFace(fd1, fd2)
{   
    var fd1Array = []
    var fd2Array = []
    for(var i in fd1)
    fd1Array.push(fd1[i])
    for(var i in fd2)
    fd2Array.push(fd2[i])

    const threshold = 0.25

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
        
        redirect = req.body.redirect
        fd = req.body.facedesc
        client = req.body.client
        

        //Represents a cursor object
        //Make sure to convert the cursor object to json
        var result = {
            id : 123,
            name : "Alan Turing",
            email : "alan@cs.com",
            fd : {0:0.9888,1:0.653,2:0.2334}
         }

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

 