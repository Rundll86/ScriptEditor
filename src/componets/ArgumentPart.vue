<template>
    <div class="container">
        <div class="title-bar" @click="toggle">
            <span class="type">{{ part.isText ? "Text" : "Arg" }}</span>
            <span class="state">{{ opening ? "▼" : "▶" }}</span>
            <span :class="{
                content: true,
                label: !part.isText
            }">{{ part.content }}</span>
        </div>
        <div class="attrs" v-if="opening">
            <WideButton @click="$emit('remove', index)">Remove</WideButton>
            Content:
            <input v-model="part.content">
            <div class="arg-only" v-if="!part.isText">
                Input type:
                <Selector v-model="part.data.inputType" :options="['String', 'Number', 'Bool']" />
                Default value:
                <input v-model="part.data.defaultValue">
                Use loader:
                <Selector v-model="part.data.loader" :options="['<Null>', 'a', 'b']" />
                Use menu:
                <Selector v-model="part.data.menu" :options="['<Null>', 'c', 'd']" />
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
            opening: this.open ?? false
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