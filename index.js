const { createApp, ref } = Vue;

const message = ref('Welcome to Games-OS! Click the button below to start playing a game.');

const app = createApp({
    setup() {
        return {
            message
        }
    }
});

app.mount('body');