<template>
    <Draggable ref="root" class="container" v-if="states?.[name] || false">
        <div class="title-bar" data-region>
            <span class="title" data-region>{{ title }}</span>
            <ToolBoxButton class="close-button" @click="close">
                <Icon src="close.png" width="15" />
            </ToolBoxButton>
        </div>
        <div class="content">
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

.close-button {
    margin-left: auto;
}
</style>
<script setup>
import Draggable from './Draggable.vue';
import Icon from './Icon.vue';
import ToolBoxButton from './ToolBoxButton.vue';
</script>
<script>
export default {
    props: {
        title: String,
        states: Object,
        name: String
    },
    methods: {
        close() {
            this.states[this.name] = false;
        }
    }
}
</script>