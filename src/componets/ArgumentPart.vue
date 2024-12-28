<template>
    <div class="container">
        <div class="title-bar" @click="toggle">
            <span class="type">{{ isText ? "Text" : "Arg" }}</span>
            <span class="state">{{ opening ? "▼" : "▶" }}</span>
            <span :class="{
                content: true,
                label: !isText
            }">{{ content }}</span>
        </div>
        <div class="attrs" v-if="opening">
            Content:
            <InputBox />
        </div>
    </div>
</template>
<script setup>
import InputBox from './InputBox.vue';
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
    padding: 3px 6px;
}

.state {
    font-size: 8px;
    margin: 5px;
}
</style>