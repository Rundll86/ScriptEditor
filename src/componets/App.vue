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
}

body {
    overflow: hidden;
}

input {
    border: 2px solid gray;
    border-radius: 5px;
    padding: 3px 5px;
    width: 100px;
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