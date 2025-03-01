<script setup lang="ts">
import Icon from './Icon.vue';
import Selector from './Selector.vue';
</script>
<template>
    <div class="bg">
        <Icon src="logo.ico" class="icon" />
        <span class="logo">ScriptEditor GUI</span>
        <Selector class="margin5 left" float :options="{
            简体中文: 'zh-CN',
            English: 'en-US'
        }" />
    </div>
</template>
<style scoped>
.bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 29px;
    padding: 10px 0;
    background-color: rgb(235, 235, 235);
    border-bottom: 1px solid gray;
    display: flex;
    align-items: center;
}

.icon {
    margin-left: 15px;
}

.logo {
    font-size: 20px;
    font-weight: bold;
    color: black;
    margin-left: 5px;
}
</style>