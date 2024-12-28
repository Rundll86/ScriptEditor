<template>
    <div ref="target" class="draggable" :style="{ left: position[0] + 'px', top: position[1] + 'px' }">
        <slot></slot>
    </div>
</template>
<script>
export default {
    data() {
        return {
            position: [0, 0],
            lastMouseOffset: [0, 0],
            isDragging: this.dragging
        }
    },
    props: {
        dragging: {
            type: Boolean,
            default: false
        },
        startx: {
            type: Number,
            default: 0
        },
        starty: {
            type: Number,
            default: 0
        }
    },
    mounted() {
        if (!window.mouse) {
            window.mouse = [0, 0];
            window.addEventListener("mousemove", (e) => {
                window.mouse = [e.clientX, e.clientY];
            });
        };
        /**
         * @type {HTMLElement}
         */
        const draggable = this.$refs.target;
        this.position = [this.startx, this.starty];
        this.lastMouseOffset = [window.mouse[0] - this.position[0], window.mouse[1] - this.position[1]];
        draggable.addEventListener("mousedown", (e) => {
            if (!Object.hasOwn(e.target.dataset, "region")) { return; };
            this.isDragging = true;
            this.lastMouseOffset = [e.clientX - this.position[0], e.clientY - this.position[1]];
        });
        window.addEventListener("mouseup", () => {
            this.isDragging = false;
        });
        window.addEventListener("mousemove", (e) => {
            if (this.isDragging) {
                this.position = [e.clientX - this.lastMouseOffset[0], e.clientY - this.lastMouseOffset[1]];
            }
        });
    }
};
</script>
<style scoped>
.draggable {
    position: absolute;
}

.draggable:deep([data-region]:hover) {
    cursor: move;
}

.draggable:deep([data-region]) {
    user-select: none;
}
</style>