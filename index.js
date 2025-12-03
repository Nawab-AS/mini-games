const { createApp, reactive, ref } = Vue;

const message = ref('Welcome to Games-OS!');
const windows = reactive([]);

setTimeout(() => {
    createWindow({
        title: 'Game 1',
        url: 'https://example.com',
        width: 800,
        height: 600,
        x: 100,
        y: 100,
        minWidth: 400,
        minHeight: 300,
    });
}, 1000);




function createWindow(options={title:'', url:'', width:600, height:400, x:50, y:50, minWidth:300, minHeight:200}) {
    const id = Math.random().toString(36).substring(2, 9);
    windows.push({ id, state: 'opening', ...options });
    setTimeout(() => {
        windows.find(w => w.id == id).state = 'open';
    }, 300);
    return id;
}

function closeWindow(id) {
    const i = windows.findIndex(win => win.id === id);
    if (i == -1) return;

    windows[i].state = 'closing';
    setTimeout(() => {
        windows.splice(i, 1);
    }, 300);
}

const app = createApp({
    setup() {
        return {
            windows,
            message,
            closeWindow,
        }
    }
});

app.mount('body');