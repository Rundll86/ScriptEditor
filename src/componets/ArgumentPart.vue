<template>
    <div class="container">
        <div class="title-bar" @click="toggle">
            <span class="type">{{ isText ? "Text" : "Arg" }}</span>
            <span class="state">{{ opening ? "▼" : "▶" }}</span>
            <span :class="{
                content: true,
                label: !isText
            }">{{ contentValue }}</span>
        </div>
        <div class="attrs" v-if="opening">
            Content:
            <input v-model="contentValue">
            <div class="arg-only" v-if="!isText">
                InputType:
                <Selector :options="['String', 'Number', 'Boolean']" />
                DefaultValue:
                <InputBox />
                UseLoader:
                <Selector :options="['<Null>']" />
                UseMenu:
                <Selector :options="['<Null>']" />
            </div>
        </div>
    </div>
</template>
<script setup>
import Selector from './Selector.vue';
</script>
<script>
export default {
    props: {
        isText: Boolean,
        content: String,
        open: Boolean
    },
    data() {
        return {
            opening: this.open ?? false,
            contentValue: this.content
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