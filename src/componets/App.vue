<template>
    <Navbar />
    <Main></Main>
</template>
<style>
* {
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    font-size: 16px;
    -webkit-user-drag: none;
    transition: all 0.2s ease-out;
}

body {
    overflow: hidden;
}

input {
    border-bottom: 2px solid gray;
    padding: 3px 5px;
    width: 150px;
    background-color: rgba(0, 0, 0, 0.05);
}

input.wide {
    width: 100%;
    box-sizing: border-box;
}

input.flexfill {
    flex-grow: 1;
}

.margin5.right {
    margin-right: 5px;
}

.margin5.left {
    margin-left: 5px;
}

.margin-auto.left {
    margin-left: auto;
}

.flex {
    display: flex;
}

.flex.vc {
    align-items: center;
}

.flex.hc {
    justify-content: center;
}

.flex.gap5 {
    gap: 5px;
}

img.size80 {
    width: 80px;
    height: 80px;
}

input:hover,
input:focus {
    background-color: rgba(0, 0, 0, 0.1);
}

span.label {
    font-size: 14px;
    display: inline-block;
    margin: 0 5px;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 2px 5px;
}

.left-auto {
    margin-left: auto !important;
}

.top-auto {
    margin-top: auto !important;
}
</style>
<script setup>
import Navbar from "./Navbar.vue";
import Main from "./Main.vue";
</script>
<script>
export default {
    mounted() {
        window.addEventListener("dragstart", e => e.preventDefault(), false);
    }
}
</script>