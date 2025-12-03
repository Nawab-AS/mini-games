const { createApp, reactive, ref } = Vue;

const windows = reactive([]);

setTimeout(() => {
    createWindow({
        title: 'Game 1',
        url: 'https://example.com',
        width: 300,
        height: 300,
        x: 100,
        y: 100,
        minWidth: 400,
        minHeight: 300,
    });
}, 1000);



// Opening/closing windows
function createWindow(options={title:'', url:'', width:600, height:400, x:50, y:50, minWidth:300, minHeight:200}) {
    const id = Math.random().toString(36).substring(2, 9);
    windows.push({ id, anim: 'opening', ...options });
    setTimeout(() => {
        windows.find(w => w.id == id).anim = '';
    }, 300);
    return id;
}

function closeWindow(e, id) {
    e.stopPropagation();
    const i = windows.findIndex(win => win.id === id);
    if (i == -1) return;
    windows[i].anim = 'closing';
    setTimeout(() => {
        windows.splice(i, 1);
    }, 300);
}

// Dragging windows
let dragData = null;
function startDrag(e, window) {
    if (e.button !== 0) return; // left click
    e.preventDefault();
    e.stopPropagation();
    dragData = {
        window,
        startX: e.clientX,
        startY: e.clientY,
        origX: window.x,
        origY: window.y
    };
}

document.addEventListener('mouseup', (e) => {
    if (!dragData) return;
    e.preventDefault();
    e.stopPropagation();
    dragData = null;
});

document.addEventListener('mousemove', (e) => {
    if (!dragData) return;
    e.preventDefault();
    e.stopPropagation();
    const dx = e.clientX - dragData.startX;
    const dy = e.clientY - dragData.startY;
    dragData.window.x = dragData.origX + dx;
    dragData.window.y = dragData.origY + dy;
});




// mount Vue
const app = createApp({
    setup() {
        return {
            windows,
            closeWindow,
            startDrag,
        }
    }
});

app.mount('body');