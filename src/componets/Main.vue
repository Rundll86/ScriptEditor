<template>
    <div class="content">
        <LeftBox :blocks="blocks" :states="windowState" />
        <RightBox :blocks="blocks" />
    </div>
    <div class="high-layer">
        <SubWindow title="Block Settings" :states="windowState" name="block">
            <ArgumentPart isText content="Alert" />
            <ArgumentPart content="something" open />
            <ArgumentPart isText content="to window" />
        </SubWindow>
        <SubWindow title="Loaders" :states="windowState" name="loaders">
            testtesttest<br>
            placeholder
        </SubWindow>
    </div>
</template>
<style scoped>
.content {
    background-color: white;
    padding-top: 70px;
}

.high-layer {
    z-index: 10;
    position: absolute;
    left: 30px;
    top: 50px;
    width: calc(100vw - 30px);
    height: calc(100vh - 50px);
}
</style>
<script setup>
import LeftBox from './LeftBox.vue';
import RightBox from './RightBox.vue';
import SubWindow from './SubWindow.vue';
import ArgumentPart from './ArgumentPart.vue';
</script>
<script>
export default {
    data() {
        return {
            blocks: [],
            windowState: {
                block: true,
                menus: false,
                loaders: false
            }
        };
    }
}
</script>