<template>
    <Draggable ref="root" :class="{
        container: true,
        activing: states.activing === name
    }" @dragstart="states.activing = name" v-if="states?.[name] || false">
        <div class="title-bar" data-region>
            <span class="title" data-region>{{ title }}</span>
            <ToolBoxButton class="close-button" @click="close">◀</ToolBoxButton>
        </div>
        <div :class="{
            content: true,
            center
        }">
            <slot></slot>
        </div>
    </Draggable>
</template>
<style scoped>
.container {
    display: flex;
    flex-direction: column;
    background-color: white;
    border: 1px solid gray;
    min-width: 250px;
    z-index: 0;
}

.container * {
    text-wrap: nowrap;
}

.container.activing {
    z-index: 1;
}

.title-bar {
    display: flex;
    align-items: center;
    background-color: rgb(235, 235, 235);
    padding: 5px 10px;
}

.content {
    padding: 15px;
}

.content.center {
    text-align: center;
}

.close-button {
    margin-left: auto;
}
</style>
<script setup>
import Draggable from "./Draggable.vue";
import ToolBoxButton from "./ToolBoxButton.vue";
</script>
<script>
export default {
    props: {
        title: String,
        states: Object,
        name: String,
        center: Boolean
    },
    methods: {
        close() {
            this.states[this.name] = false;
        }
    }
}
</script>