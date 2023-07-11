const DefaultTheme = 'dark'

setTheme = (theme) =>
{
	localStorage.setItem('theme', theme);
	document.documentElement.className = `theme-${theme}`
}

toggleTheme = () => setTheme(localStorage.getItem('theme') === 'dark' ? 'light' : 'dark')

// Called immediately at script initialisation/load
setTheme(localStorage.getItem('theme') ?? DefaultTheme)