const express = require('express')
var cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
const port = 3081

app.use('/',function(req, res, next)
{
  if (req.hostname == "localhost")
    next()
  else
    res.send('<h2 style="color:red">Access not allowed</h2>');
})

app.get('/', (req, res) => {
  res.send('<h2 style="color:red">Welcome!</h2>')
})
app.get('/verify', (req, res) => {
  domain = req.body.client

  //fetch all domains from db and use toArray()
  domainSet = ["google","yahoo"]
  if(domainSet.indexOf(domain) != -1)
    res.status(200).json({"verified":"true"})
  else
    res.status(401).json({"verified":"false"})
  
})

app.use('/signup', require('./api/signup'))
app.use('/login', require('./api/login').router)


app.listen(port)


