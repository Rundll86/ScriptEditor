<template>
    <div class="left-box">
        <div class="tools">
            <ToolBtn @click="openWindow('block')">
                <!-- <Icon src="block.png" /> -->
                Blok
            </ToolBtn>
            <ToolBtn>
                <!-- <Icon src="block.png" /> -->
                Menu
            </ToolBtn>
            <ToolBtn @click="openWindow('loaders')">
                <!-- <Icon src="block.png" /> -->
                Load
            </ToolBtn>
            <ToolBtn>
                <!-- <Icon src="block.png" /> -->
                Data
            </ToolBtn>
            <ToolBtn>
                <!-- <Icon src="block.png" /> -->
                Pkg
            </ToolBtn>
            <ToolBtn>
                <!-- <Icon src="block.png" /> -->
                Res
            </ToolBtn>
            <ToolBtn>
                <!-- <Icon src="block.png" /> -->
                Adv
            </ToolBtn>
            <ToolBtn @click="openWindow('project')">
                <!-- <Icon src="block.png" /> -->
                Proj
            </ToolBtn>
        </div>
    </div>
</template>
<script setup>
import Icon from './Icon.vue';
import ToolBtn from './ToolBoxButton.vue';
</script>
<style scoped>
.left-box {
    position: fixed;
    left: 0;
    top: 50px;
    height: 100vh;
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