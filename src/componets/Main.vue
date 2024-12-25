<template>
    <div class="content">
        <Member name="Syuiok" avatar="/public/img/Syuiok.jpg" des="美术/创始人" />
        <Member name="Zane" avatar="/public/img/Zane.jpg" des="程序/创始人" />
        <Member name="FallingShrimp" avatar="/public/img/FallingShrimp.jpg" des="程序/创始人" />
    </div>
</template>
<style scoped>
.content {
    min-height: 100vh;
    background-color: rgb(25, 25, 25);
    padding-top: 70px;
}
</style>
<script setup>
import Member from './Member.vue';
</script>