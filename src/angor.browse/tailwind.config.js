module.exports = {
    darkMode: 'class',
    content: ["./**/*.{razor,html,cshtml}", "./node_modules/flowbite/**/*.js"],
    theme: {
        extend: {
            fontFamily: {
                'montserrat': ['Montserrat'],
            },
        },
    },
    plugins: [
        require('flowbite/plugin')
    ],   
}
