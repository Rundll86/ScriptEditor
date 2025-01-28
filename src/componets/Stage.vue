<template>
    <canvas></canvas>
</template>
<style scoped>
canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
}

canvas:hover {
    cursor: move;
}
</style>
<script setup>
import { Drawing } from "../tools";
</script>
<script>
const contentCanvas = document.createElement("canvas");
export default {
    mounted() {
        this.reloadSize();
        window.addEventListener("resize", () => this.reloadSize());
    },
    methods: {
        reloadSize() {
            contentCanvas.width = this.$el.width;
            contentCanvas.height = this.$el.height;
            this.contentContext.beginPath();
            this.contentContext.clearRect(0, 0, contentCanvas.width, contentCanvas.height);
            this.contentContext.drawImage(this.$el, 0, 0, contentCanvas.width, contentCanvas.height);
            this.contentContext.closePath();
            let canvas = this.$el;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.getContext("2d").drawImage(contentCanvas, 0, 0, contentCanvas.width, contentCanvas.height);
            Drawing.initWith(canvas);
        }
    },
    data() {
        return {
            contentContext: contentCanvas.getContext("2d")
        };
    }
}
</script>