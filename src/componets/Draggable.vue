<template>
    <div ref="target" class="draggable" :style="{
        left: position[0] + 'px',
        top: position[1] + 'px'
    }" @mousedown.stop @mousedown="startDrag" @touchstart="startDrag({
        target: $event.target,
        clientX: $event.touches[0].clientX,
        clientY: $event.touches[0].clientY
    })">
        <slot></slot>
    </div>
</template>
<script setup lang="ts">
import { defineComponent } from "vue";
</script>
<script lang="ts">
export default defineComponent({
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
        x: {
            type: Number,
            default: 0
        },
        y: {
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
        this.position = [this.x, this.y];
        this.lastMouseOffset = [window.mouse[0] - this.position[0], window.mouse[1] - this.position[1]];
        window.addEventListener("mouseup", this.endDrag);
        window.addEventListener("mousemove", this.changeDrag);
        window.addEventListener("touchmove", (e) => {
            this.changeDrag({
                clientX: e.touches[0].clientX,
                clientY: e.touches[0].clientY
            });
        });
        window.addEventListener("touchend", this.endDrag);
    },
    watch: {
        position(value) {
            this.$emit("update:x", value[0]);
            this.$emit("update:y", value[1]);
        }
    },
    methods: {
        startDrag(e: {
            target: EventTarget | null,
            clientX: number,
            clientY: number
        }) {
            if (
                e.target
                && e.target instanceof HTMLElement
                && e.target.matches("[data-region] *, [data-region]")
                && !e.target.matches("[data-no-region]")
            ) {
                this.isDragging = true;
                this.lastMouseOffset = [e.clientX - this.position[0], e.clientY - this.position[1]];
                this.$emit("dragstart");
            };
        },
        changeDrag(e: {
            clientX: number,
            clientY: number
        }) {
            if (this.isDragging) {
                this.position = [e.clientX - this.lastMouseOffset[0], e.clientY - this.lastMouseOffset[1]];
                this.$emit("change");
            };
        },
        endDrag() {
            this.isDragging = false;
            this.$emit("dragend");
        }
    }
});
</script>
<style scoped>
.draggable {
    transition: none;
    position: absolute;
}

.draggable:deep([data-region]:hover) {
    cursor: move;
}

.draggable:deep([data-region]) {
    user-select: none;
}
</style>