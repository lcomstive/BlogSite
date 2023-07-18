const DefaultFont = 'Open Sans'
const DefaultFontSize = 18

// Load theme
let theme = localStorage.getItem('theme')
if(theme == null)
{
	// Check if device has accessible preference for theme (light vs. dark mode)
	if(window.matchMedia)
	{
		// Set to light or dark mode if device has preference
		if (window.matchMedia('(prefers-color-scheme: dark)').matches)
			theme = 'Dark'
		else
			theme = 'Light'
	}
	else // Device does not have any accessible preferences related to light/dark mode
		theme = 'Dark'

	localStorage.setItem('theme', theme)
}

// Load font
let font = localStorage.getItem('font') ?? DefaultFont
let fontSize = localStorage.getItem('fontSize') ?? DefaultFontSize

// Apply settings
document.documentElement.className = `theme-${theme.toLowerCase().replaceAll(' ', '-')}`
document.body.style.fontFamily = `${font}, sans-serif`
document.body.style.fontSize = fontSize + 'px'

// Add font to page. Uses Google Font as preference, but falls back to built-in fonts
document.head.innerHTML += `<link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'"
				href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}&display=swap">`