<template>
    <div class="right-box">
        <!-- <ScratchBlock>test [abc:number=1] apple</ScratchBlock> -->
        <div v-for="block in blocks" :key="block.opcode">
            <ScratchBlock>{{ block.text }}</ScratchBlock>
        </div>
    </div>
</template>
<style scoped>
.right-box {
    position: fixed;
    right: 0;
    top: 50px;
    height: 100vh;
    background-color: rgb(235, 235, 235);
    border-left: 1px solid gray;
    padding: 10px;
}
</style>
<script>
export default {
    props: {
        blocks: Array
    }
}
</script>
<script setup>
import ScratchBlock from './ScratchBlock.vue';
</script>