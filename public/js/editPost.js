const VideoExtensions = [ 'mp4', 'webm', 'ogg']
const MinEditorLines = 10

var headerMediaFileChooser = null
var headerMediaPreview = null

var contentEditor = null
var contentPreviewer = null

const MinSizeForSplitter = 1100 // pixels, width
var splitter = null

const splitterOptions =
{
	minSize: [ 0, 0 ],
	snapOffset: 0,
	dragInterval: 1
}

OnContentChanged = () =>
{	
	/*
	let scrollPos = document.documentElement.scrollTop

	// Adjusts size of the textarea containing article contents
	contentEditor.style.height = "1px";
	contentEditor.style.height = (25 + contentEditor.scrollHeight) + "px";

	document.documentElement.scrollTop = scrollPos
	*/

	let lines = contentEditor.value.match(/\r|\n/gm)?.length ?? 0
	let fontSize = document.body.style.fontSize.replaceAll('px', '') * 1.4
	contentEditor.style.minHeight = Math.max(lines, MinEditorLines) * fontSize + 'px'

	contentPreviewer.innerHTML = FormatPost(contentEditor.value)
}

GetFileSize = (bytes) =>
{
	let counter = 0
	while(bytes > 1024)
	{
		counter++
		bytes /= 1024
	}

	return `${bytes.toFixed(1)} ` + [ 'B', 'KB', 'MB', 'GB' ][Math.min(counter, 3)] 
}

UpdateHeaderPreview = (clear = false) =>
{
	headerMediaPreview.innerHTML = ''

	let files = headerMediaFileChooser.files
	if(headerMediaFileChooser.value && files.length == 0)
		files = headerMediaFileChooser.value

	if((files?.length || 0) == 0 || clear == true)
	{
		headerMediaFileChooser.value = null
		headerMediaPreview.innerHTML = '<p>No file chosen</p>'
		return
	}

	let isVideo = VideoExtensions.includes(files[0].name.split('.').pop())

	const media = document.createElement(isVideo ? 'video' : 'img')
	if(isVideo)
		media.controls = true
	media.src = URL.createObjectURL(files[0])
	headerMediaPreview.appendChild(media)

	const description = document.createElement('p')
	description.innerHTML = `${files[0].name} (${GetFileSize(files[0].size)})`
	headerMediaPreview.appendChild(description)

	const removeButton = document.createElement('button')
	removeButton.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>'
	removeButton.onclick = (event) =>
	{
		event.preventDefault()
		UpdateHeaderPreview(/* clear */ true)
	}
	headerMediaPreview.appendChild(removeButton)
}

ValidateForm = () =>
{
	if(document.getElementsByName('title')[0].value == '' ||
		document.getElementsByName('description')[0].value == '' ||
		document.getElementsByName('content')[0].value == '')
		return false
	return true
}

SetHeaderMediaToFilepath = (filepath) =>
{
	headerMediaPreview.innerHTML = ''

	if(!filepath || filepath == '')
	{
		headerMediaFileChooser.value = null
		headerMediaPreview.innerHTML = '<p>No file chosen</p>'
		return
	}

	let isVideo = VideoExtensions.includes(filepath.split('.').pop())

	const media = document.createElement(isVideo ? 'video' : 'img')
	if(isVideo)
		media.controls = true
	media.src = filepath
	headerMediaPreview.appendChild(media)

	const description = document.createElement('p')
	description.innerHTML = `${filepath}`
	headerMediaPreview.appendChild(description)

	const removeButton = document.createElement('button')
	removeButton.id = 'buttonRemove'
	removeButton.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>'
	removeButton.onclick = (event) =>
	{
		event.preventDefault()
		UpdateHeaderPreview(/* clear */ true)
	}
	headerMediaPreview.appendChild(removeButton)
}

TogglePreview = () =>
{
	document.getElementById('previewToggle').classList.toggle('active')
	document.getElementById('contentEditor').classList.toggle('active')
	document.getElementById('contentPreview').classList.toggle('active')
}

WindowResized = () =>
{
	if(window.innerWidth >= MinSizeForSplitter && splitter == null)
		splitter = Split([ '#contentEditor', '#contentPreview' ], splitterOptions)
	else if(window.innerWidth < MinSizeForSplitter && splitter != null)
	{
		splitter.destroy()
		splitter = null
	}
}

window.addEventListener('resize', WindowResized)

window.addEventListener('load', () =>
{
	marked.use({
		mangle: false,
		headerIds: false
	})
	contentEditor = document.getElementById('contentEditor')
	contentPreviewer = document.getElementById('contentPreview')

	contentEditor.addEventListener('input', OnContentChanged)
	OnContentChanged()

	headerMediaFileChooser = document.getElementById('headerMedia')
	headerMediaPreview = document.getElementById('headerPreview')

	headerMediaFileChooser.addEventListener('change', UpdateHeaderPreview)

	UpdateHeaderPreview()

	WindowResized()
})