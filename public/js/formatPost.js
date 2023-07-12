String.prototype.replaceAt = function(index, length, replacement)
{ return this.substring(0, index) + replacement + this.substring(index + length) }

FormatPost = (contents) =>
{
	// Convert Windows-endings to Unix-endings
	contents = contents.replaceAll('\r\n', '\n').replaceAll('<br>', '\n')

	// Surround quotes with <q>
	let match = null
	while(match = /^((>\ +(.*))\s)+/gm.exec(contents))
	{
		let replacement = match[0].replaceAll('> ', '').trim().replaceAll('\n', '<br>')
		contents = contents.replaceAt(match.index, match[0].length, `<q>${replacement}</q><br>`)
	}
	
	return marked.parse(contents)
}