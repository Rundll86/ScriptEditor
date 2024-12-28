<template>
    <img :src="`/public/img/icons/${src}`" :alt="src" :style="{ '--w': `${width}px` }">
</template>
<script>
export default {
    props: {
        src: String,
        width: {
            type: String,
            default: "20"
        }
    }
};
</script>
<style scoped>
img {
    --w: 20px;
    width: var(--w);
    height: var(--w);
}
</style>