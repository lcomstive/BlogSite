const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
	title: String,
	description: String,
	content: String,
	url: String,
	headerMedia: String,
	headerMediaType: String,
	tags: [String],
	isActive:
	{
		type: Boolean,
		default: true
	},
	createdAt:
	{
		type: Date,
		default: new Date()
	}
})

module.exports = mongoose.model('Post', PostSchema)