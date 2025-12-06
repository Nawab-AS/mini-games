const { createApp, reactive, ref, computed } = Vue;

const windows = reactive([]);
const currentTime = ref('');
const hoveredApp = ref(null);
const editingWindow = ref(false);
const fuzzySearchThreshold = 3;
let topZ = 99;

setTimeout(() => {
    createWindow("Welcome");
}, 1000);


// Opening/closing windows
function createWindow(appname, options={}) {
    options={...apps[appname], ...options};
    const id = Math.random().toString(36).substring(2, 9);
    if (options.url.startsWith('./')) options.url = (new URL(options.url, window.location.href)).href; // convert to absolute URL
    // Ensure window is always fully visible and not under the taskbar
    const margin = 20;
    const maxX = Math.max(0, window.innerWidth - (options.width || 400) - margin);
    const maxY = Math.max(0, window.innerHeight - (options.height || 300) - margin - 40 - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--taskbar-height')) || 35));
    if (options.x === undefined) options.x = Math.round(Math.random() * maxX) + margin / 2;
    if (options.y === undefined) options.y = Math.round(Math.random() * maxY) + margin / 2;
    windows.push({ ...options, id, anim: 'opening', app: appname, hidden: false, z: ++topZ });
    setTimeout(() => {
        windows.find(w => w.id == id).anim = '';
    }, 300);
}

function closeWindow(e, id) {
    const i = windows.findIndex(win => win.id === id);
    if (i == -1) return;
    windows[i].anim = 'closing';
    setTimeout(() => {
        windows.splice(i, 1);
    }, 300);
}

function bringToFront(e, id) {
    e.stopPropagation();
    const window = windows.find(win => win.id === id);
    if (!window) return;
    if (window.hidden) {
        window.hidden = false;
        window.anim = 'unminimizing';
        setTimeout(() => {
            window.anim = '';
        }, 300);
    }
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
    editingWindow.value = true;
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
    editingWindow.value = true;
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
    editingWindow.value = false;
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


// hiding/showing windows
function minimizeWindow(e, id) {
    e.stopPropagation();
    const window = windows.find(win => win.id === id);
    if (!window) return;
    window.anim = 'minimizing';
    setTimeout(() => {
        window.hidden = true;
    }, 300);
}


function focusWindow(e, id, windowList=false) {
    const window = windows.find(w => w.id === id);
    if (!window) return;
    e.stopPropagation();
    if (windowList) {
        if (window.hidden) {
            window.hidden = false;
            setTimeout(() => {
                window.anim = 'unminimizing';
                setTimeout(() => {
                    window.anim = '';
                }, 200);
            }, 100);
        } else {
            minimizeWindow(e, id);
            return;
        }
    }
}


// linux menu
const search = ref(null);
function openSearch() {
    document.getElementById('searchBox').focus();
    search.value = '';
}

const filteredApps = computed(() => {
    const results = fuzzysort.go(search.value, Object.keys(apps), {all: true});

    // filter out low-score results + convert to array
    let filtered = [];
    for (let i = 0; i < results.length; i++) {
        if (results[i].score < -fuzzySearchThreshold) continue;
        const appName = results[i].target;
        filtered.push({ appName, category: apps[appName].category || 'Other' });
    }

    // group filtered apps by category
    const grouped = {};
    filtered.forEach((_) => {
        let { appName, category } = _;
        category = category || 'Other';
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(appName);
    });
    for (const category in grouped) {
        grouped[category].sort();
    }
    const result = { length: filtered.length, apps: grouped, topResult: filtered[0]?.appName || null };
    return result;
});


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
            createWindow,
            closeWindow,
            editingWindow,
            startDrag,
            startResize,
            currentTime,
            openSearch,
            search,
            filteredApps,
            apps,
            bringToFront,
            minimizeWindow,
            focusWindow,
            hoveredApp,
        }
    }
});

app.mount('body');