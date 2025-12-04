const { createApp, reactive, ref } = Vue;

const windows = reactive([]);
const currentTime = ref('');
let topZ = 99;

setTimeout(() => {
    createWindow(apps["Welcome"]);
}, 1000);



// Opening/closing windows
function createWindow(options={title:'', url:'', icon:'', width:600, height:400, x:50, y:50, minWidth:300, minHeight:200}) {
    const id = Math.random().toString(36).substring(2, 9);
    if (options.url.startsWith('./')) options.url = (new URL(options.url, window.location.href)).href; // convert to absolute URL
    
    windows.push({ id, anim: 'opening', z: ++topZ, ...options });
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

function bringToFront(e, id) { // TODO: fix
    e.stopPropagation();
    const window = windows.find(win => win.id === id);
    if (!window) return;
    window.z = ++topZ;
    windows.sort((a, b) => a.z - b.z);
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

// Resizing windows
let resizeData = null;
function startResize(e, window) {
    if (e.button !== 0) return; // left click
    e.preventDefault();
    e.stopPropagation();
    resizeData = {
        window,
        startX: e.clientX,
        startY: e.clientY,
        origW: window.width,
        origH: window.height,
        minW: window.minWidth || 100,
        minH: window.minHeight || 80
    };
    // prevent text selection while resizing
    document.body.style.userSelect = 'none';
}

document.addEventListener('mouseup', (e) => {
    if (dragData) {
        e.preventDefault();
        e.stopPropagation();
        dragData = null;
    }
    if (resizeData) {
        e.preventDefault();
        e.stopPropagation();
        resizeData = null;
        document.body.style.userSelect = '';
    }
});

document.addEventListener('mousemove', (e) => {
    if (dragData) {
        const dx = e.clientX - dragData.startX;
        const dy = e.clientY - dragData.startY;
        dragData.window.x = dragData.origX + dx;
        dragData.window.y = dragData.origY + dy;
        return;
    }

    if (resizeData) {
        const dx = e.clientX - resizeData.startX;
        const dy = e.clientY - resizeData.startY;
        let newW = Math.max(resizeData.minW, Math.round(resizeData.origW + dx));
        let newH = Math.max(resizeData.minH, Math.round(resizeData.origH + dy));
        resizeData.window.width = newW;
        resizeData.window.height = newH;
        return;
    }
});

// linux menu
const search = ref(null);
function openSearch() {
    document.getElementById('searchBox').focus();
    search.value = '';
}

function closeSearch() {
    search.value = null;
}


// time
function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    currentTime.value = `${hours}:${minutes} ${ampm}`;
}
setInterval(updateTime, 1000);
updateTime();



// mount Vue
const app = createApp({
    setup() {
        return {
            windows,
            closeWindow,
            startDrag,
            startResize,
            currentTime,
            openSearch,
            closeSearch,
            search,
            bringToFront,
        }
    }
});

app.mount('body');