<template>
    <div class="content">
        <LeftBox :blocks="blocks" :states="windowState" />
        <RightBox :blocks="blocks" />
    </div>
    <div class="high-layer">
        <SubWindow title="Block Settings" :states="windowState" name="block">
            <div class="args">
                <ArgumentPart v-for="part in parts" :isText="part.isText" :content="part.content" />
            </div>
            <div class="config-bar">
                UseDecorator
                <CheckBox class="left-auto" />
            </div>
            <div class="config-bar">
                Add Parts
                <WideButton class="left-auto" @click="addText">Text</WideButton>
                <WideButton @click="addArg">Arg</WideButton>
            </div>
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

.left-auto {
    margin-left: auto;
}

.args {
    overflow-y: auto;
    max-height: 50vh;
    border: 1px solid gray;
    margin-bottom: 10px;
}

.config-bar {
    display: flex;
    align-items: center;
}
</style>
<script setup>
import LeftBox from './LeftBox.vue';
import RightBox from './RightBox.vue';
import SubWindow from './SubWindow.vue';
import ArgumentPart from './ArgumentPart.vue';
import CheckBox from './CheckBox.vue';
import WideButton from './WideButton.vue';
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
            },
            parts: [
                {
                    content: 'Alert',
                    isText: true
                },
                {
                    content: 'something',
                    isText: false
                },
                {
                    content: 'to window',
                    isText: true
                }
            ]
        };
    },
    methods: {
        addText() {
            this.parts.push({
                content: "new text",
                isText: true
            });
        },
        addArg() {
            this.parts.push({
                content: "argName",
                isText: false
            });
        }
    }
}
</script>