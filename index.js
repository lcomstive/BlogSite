const fs = require('fs')
const path = require('path')
const https = require('https')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressEdge = require('express-edge')
const fileUpload = require('express-fileupload')

require('dotenv').config()

const ImageDir = path.join(__dirname, 'public/')
const VideoExtensions = [ 'mp4', 'webm', 'ogg']

// Database models
const Post = require('./database/models/Post')

// Set up express app
const app = new express()

app.use(fileUpload())
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(expressEdge)
app.set('views', __dirname + '/views')

// Routing
app.get('/', require('./controllers/homePage'))
app.get('/posts', require('./controllers/allPosts'))

const newPost = require('./controllers/newPost')
app.get('/post/new', newPost.get)
app.post('/post/create', newPost.post)

app.get('/post/:title', require('./controllers/getPost'))

const editPost = require('./controllers/updatePost')
app.get('/post/edit/:title', editPost.get)
app.post('/post/update/:title', editPost.post)

// Set up MongoDB connection
let mongoIP = process.env.MONGO_IP || "127.0.0.1"
let mongoPort = process.env.MONGO_PORT || 27017
let dbName = process.env.MONGO_DBNAME || 'blog'
mongoose.connect(`mongodb://${mongoIP}:${mongoPort}/${dbName}`, { useNewUrlParser: true })
	.then(() => console.log('Connected to Mongo'))
	.catch(err => console.error('Failed to connect to Mongo database', err))

// Start listening
let port = process.env.PORT || 3000
let sslKey = process.env.SSL_KEY
let sslCert = process.env.SSL_CERT

onServerStart = () => console.log(`Started server on port ${port}`)

if(sslKey && sslCert) // Start in HTTPS (secure) mode
{
	app.set('trust proxy', 1) // Trust first proxy
	app.enable('trust proxy')
	console.log('Starting in secure (HTTPS) mode')

	https.createServer({
		key: fs.readFileSync(sslKey),
		cert: fs.readFileSync(sslCert)
	}, app).listen(port, onServerStart)
}
else
	app.listen(port, onServerStart)