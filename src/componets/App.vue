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
}

span.label {
    font-size: 14px;
    display: inline-block;
    margin: 0 5px;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 2px 5px;
}
</style>
<script setup>
import Navbar from './Navbar.vue';
import Main from './Main.vue';
</script>