# Game-OS

A better recreation of my old project [Retro-OS](https://github.com/nawab-as/retro-os) with a focus on games.

> Note for siege reviewers:
> This project was originally made for Shipwrecked, but now rewritten from scratch as Game-OS, so technically not updates siege project

## Live Demo

You can try out the live demo [here](https://nawab-as.github.io/Game-OS).


## Usage

- Click the app icons in the taskbar to open games or utilities
- Use the search box to quickly find and launch apps
- Drag, resize, minimize, or close windows as you like


### Features

- Windows 10-style desktop interface (except its linux)
- Playable mini-games:
	- Tic Tac Toe
	- Minesweeper
	- Snake
	- Calculator
    - More coming soon...
- Window management system with taskbar
- App launcher and search
- Draggable, resizable windows


## Installation

### Requirements
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Local development server

### Setup
1. Clone the repository:
```bash
git clone https://github.com/Nawab-AS/Game-OS.git
cd Game-OS
```

2. Host using any web server

Since this is a static web page, you can host it with any web server, personally, I used python's builtin http server with:
```bash
python -m http.server -p 3000
```
Then visit `http://localhost:3000` in your browser


## Adding/Removing apps

### Adding apps

> [!NOTE]
> 
> Some websites block embedding within iframes as part of the Content-Security-Policy (CSP).
> Such websites will not work in this project.

In the `app.js` file edit the following:
```
const apps = {
    // ... previous code ...

    "<App name>": {
        "url": "<url to html>",
        "icon": "<url to icon>, // png, jpeg, svg, or webp
        "category": "<Category>",
        "hideFromTaskbar": true, // optional

        "width": <default width>,
        "height": <default height>,
        "minWidth": <minimum width>,
        "minHeight": <minimum height>,
    },
};
```

#### Example: adding Tic Tac Toe game
```
const apps = {
    // ... previous code ...

    "Tic Tac Toe": {
        "url": "https://my-cool-tic-tac-toe-game.com",
        "icon": "https://my-cool-tic-tac-toe-game.com/myIcon.png",
        "category": "Games",
        "width": 300,
        "height": 500,
        "minWidth": 275,
        "minHeight": 540,
    },
};
```



### Removing apps
To remove an app, simply delete its entry from the `apps` object in `app.js`. For example, to remove "Tic Tac Toe", remove the following block:

```js
"Tic Tac Toe": {
    "url": "https://my-cool-tic-tac-toe-game.com",
    "icon": "https://my-cool-tic-tac-toe-game.com/myIcon.png",
    "category": "Games",
    "width": 300,
    "height": 500,
    "minWidth": 275,
    "minHeight": 540,
},
```



## Attributions and Acknowledgements

- Part of the CSS for the calculator was AI generated, the rest of the code is ~90% human written.
- Minesweeper game adapted from [adlogi/minesweeper](https://github.com/adlogi/minesweeper).
