<template>
    <div class="container">
        <div class="title-bar" @click="toggle">
            <span class="type">{{ part.isText ? "文本" : `${argType}参数` }}</span>
            <span class="state">{{ opening ? "▼" : "▶" }}</span>
            <span :class="{
                content: true,
                label: !part.isText
            }">{{ part.content }}</span>
        </div>
        <div class="attrs" v-if="opening">
            <WideButton @click="$emit('remove', index)">删除此组件</WideButton>
            内容：
            <input v-model="part.content">
            <div class="arg-only" v-if="!part.isText">
                输入类型：
                <Selector v-model="part.data.inputType" v-model:option="argType"
                    :options="{ 字符串: 'string', 数字: 'number', 布尔值: 'bool' }" />
                默认值：
                <input v-model="part.data.defaultValue">
                使用参数加载器：
                <Selector v-model="part.data.loader" :options="{ '<Null>': null, 'a': 'a', 'b': 'b' }" />
                使用菜单：
                <Selector v-model="part.data.menu" :options="{ '<Null>': null, 'a': 'a', 'b': 'b' }" />
            </div>
        </div>
    </div>
</template>
<script setup>
import Selector from './Selector.vue';
import WideButton from './WideButton.vue';
</script>
<script>
export default {
    props: {
        open: Boolean,
        part: Object,
        index: Number
    },
    data() {
        return {
            opening: this.open ?? false,
            argType: "字符串"
        };
    },
    methods: {
        toggle() {
            this.opening = !this.opening;
        }
    }
};
</script>
<style scoped>
.container {
    border: 1px solid gray;
    margin: 5px;
}

.title-bar {
    display: flex;
    align-items: center;
    padding: 3px 6px;
}

.content {
    margin-left: auto;
}

.attrs {
    border-top: 1px solid gray;
    padding: 10px;
    display: flex;
    flex-direction: column;
}

.arg-only {
    display: flex;
    flex-direction: column;
}

.state {
    font-size: 8px;
    margin: 5px;
}
</style>