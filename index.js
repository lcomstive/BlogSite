require('dotenv').config()
const path = require('path')
const express = require('express')
const expressEdge = require('express-edge')

// Set up express app
const app = new express()

app.use(express.static('public'))

app.use(expressEdge)
app.set('views', __dirname + '/views')

// Routing

app.get('/', (req, res) => res.render('index'))
app.get('/test', (req, res) => res.sendFile(path.resolve(__dirname, 'pages/index.html')))

// Start listening
let port = process.env.PORT || 3000
app.listen(port, () => console.group(`App listening on port ${port}`))