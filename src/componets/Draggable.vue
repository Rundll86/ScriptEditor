<template>
    <div ref="target" class="draggable" :style="{ left: position[0] + 'px', top: position[1] + 'px' }">
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
        const draggable: HTMLElement = this.$refs.target as HTMLElement;
        this.position = [this.x, this.y];
        this.lastMouseOffset = [window.mouse[0] - this.position[0], window.mouse[1] - this.position[1]];
        draggable.addEventListener("mousedown", e => {
            if (
                e.target
                && e.target instanceof HTMLElement
                && e.target.matches("[data-region] *, [data-region]")
                && !e.target.matches("[data-no-region]")
            ) {
                window.dragging = true;
                this.isDragging = true;
                this.lastMouseOffset = [e.clientX - this.position[0], e.clientY - this.position[1]];
                this.$emit("dragstart");
            };
        });
        window.addEventListener("mouseup", () => {
            window.dragging = false;
            this.isDragging = false;
            this.$emit("dragend");
        });
        window.addEventListener("mousemove", (e) => {
            if (this.isDragging) {
                this.position = [e.clientX - this.lastMouseOffset[0], e.clientY - this.lastMouseOffset[1]];
                this.$emit("change");
            };
        });
    },
    watch: {
        position(value) {
            this.$emit("update:x", value[0]);
            this.$emit("update:y", value[1]);
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