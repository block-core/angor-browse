// Read theme from local storage
const savedTheme = localStorage.getItem('theme');

// Load dark mode from local storage
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.querySelector("html").classList.add('dark');
    const lightdark = document.querySelectorAll('[data-type="theme"]');

    for (let i = 0; i < lightdark.length; i++) {
        lightdark[i].checked = true;
    }
}

function applyDarkMode(isDarkMode) {
    const htmlElement = document.querySelector("html");
    const themeElements = document.querySelectorAll('[data-type="theme"]');

    if (isDarkMode) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    themeElements.forEach(element => {
        element.checked = isDarkMode;
    });

    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

