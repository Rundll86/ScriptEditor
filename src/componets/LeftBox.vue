<template>
    <div class="left-box">
        <div class="tools">
            <ToolBtn @click="openWindow('node')" tip="节点">
                <Icon src="node.svg" />
            </ToolBtn>
            <ToolBtn @click="openWindow('character')" tip="角色">
                <Icon src="menu.svg" />
            </ToolBtn>
            <ToolBtn @click="openWindow('script')" tip="脚本">
                <Icon src="resource.svg" />
            </ToolBtn>
            <ToolBtn @click="openWindow('asset')" tip="资源">
                <Icon src="dataStore.svg" />
            </ToolBtn>
            <ToolBtn @click="openWindow('project')" tip="项目">
                <Icon src="project.svg" />
            </ToolBtn>
            <ToolBtn @click="openWindow('about')" class="top-auto" tip="关于">
                <Icon src="about.svg" />
            </ToolBtn>
            <ToolBtn @click="openWindow('projectMgr')" tip="项目管理器" v-if="isDesktop()">
                <Icon src="logo.ico" />
            </ToolBtn>
        </div>
    </div>
</template>
<script setup lang="ts">
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
<script lang="ts">
export default {
    props: {
        states: {
            type: Object,
            required: true
        }
    },
    methods: {
        openWindow(name: string) {
            this.states[name] = true;
        },
        isDesktop() {
            return window.isDesktop;
        }
    }
}
</script>