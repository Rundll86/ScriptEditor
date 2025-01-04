<template>
    <div class="left-box">
        <div class="tools">
            <ToolBtn @click="openWindow('block')">
                <Icon src="block.svg" />
            </ToolBtn>
            <ToolBtn>
                <Icon src="menu.svg" />
            </ToolBtn>
            <ToolBtn @click="openWindow('loaders')">
                <Icon src="loader.svg" />
            </ToolBtn>
            <ToolBtn>
                <Icon src="dataStore.svg" />
            </ToolBtn>
            <ToolBtn>
                <Icon src="package.svg" />
            </ToolBtn>
            <ToolBtn>
                <Icon src="resource.svg" />
            </ToolBtn>
            <ToolBtn>
                <Icon src="advanced.svg" />
            </ToolBtn>
            <ToolBtn @click="openWindow('project')">
                <Icon src="project.svg" />
            </ToolBtn>
            <ToolBtn @click="openWindow('node')">
                <Icon src="node.svg" />
            </ToolBtn>
            <ToolBtn @click="openWindow('about')" class="top-auto">
                <Icon src="about.svg" />
            </ToolBtn>
        </div>
    </div>
</template>
<script setup>
import Icon from "./Icon.vue";
import ToolBtn from "./ToolBoxButton.vue";
</script>
<style scoped>
.left-box {
    position: fixed;
    left: 0;
    top: 50px;
    height: calc(100vh - 50px);
    background-color: rgb(235, 235, 235);
    border-right: 1px solid gray;
    display: flex;
}

.left-content {
    border-left: 1px solid gray;
    padding: 10px;
    height: 40vh;
}

.left-content>div {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.tools {
    display: flex;
    flex-direction: column;
}

.mode-title {
    font-weight: bold;
    margin-bottom: 10px;
    display: inline-block;
}
</style>
<script>
export default {
    props: {
        blocks: Array,
        states: {
            type: Object,
            required: true
        }
    },
    methods: {
        openWindow(name) {
            this.states[name] = true;
        }
    }
}
</script>