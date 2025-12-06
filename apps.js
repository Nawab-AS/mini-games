// This is basically a json file but with comments and without needing to fetch from index.js
const apps = {
    "Welcome": { // auto-opens
        "url": "./games/welcome/welcome.html",
        "icon": "https://bluemoji.io/cdn-proxy/646218c67da47160c64a84d5/66b3e5d0c2ab246786ca1d5e_86.png",
        "description": "Welcome to Mini Games!",
        "category": "Utility",

        "width": 600,
        "height": 400,
        "minWidth": 400,
        "minHeight": 300,
    },

    "Tic Tac Toe": {
        "url": "./games/tic-tac-toe/index.html",
        "icon": "./games/tic-tac-toe/icon.svg",
        "description": "Play Tic Tac Toe against the computer!",
        "category": "Web",
        "width": 400,
        "height": 540,
        "minWidth": 400,
        "minHeight": 540,
    },

    "Reddit": {
        "url": "https://www.reddit.com/",
        "icon": "https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png",
        "description": "Browse Reddit in a window.",
        "category": "Web",
        "width": 900,
        "height": 700,
        "minWidth": 600,
        "minHeight": 400,
    },

    "Calculator": {
        "url": "./games/calculator/index.html",
        "icon": "./games/calculator/icon.svg",
        "description": "A simple calculator app.",
        "category": "Utility",
        "width": 300,
        "height": 400,
        "minWidth": 300,
        "minHeight": 400,
    },

    "Snake": {
        "url": "./games/snake/index.html",
        "icon": "./games/snake/icon.svg",
        "description": "Classic Snake game.",
        "category": "Games",
        "width": 400,
        "height": 500,
        "minWidth": 400,
        "minHeight": 500,
    },
};