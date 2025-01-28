<template>
    <button class="btn">
        <div class="tip-container" v-if="tip">
            <div class="tip">{{ tip }}</div>
        </div>
        <slot></slot>
    </button>
</template>
<style scoped>
.btn {
    width: 30px;
    height: 30px;
    background-color: transparent;
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-wrap: nowrap;
    font-size: 12px;
    position: relative;
}

.btn:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.tip-container {
    position: absolute;
    left: calc(100% + 10px);
    top: 0;
    display: flex;
    align-items: center;
    width: 75px;
    transform-origin: 0% 50%;
    opacity: 0;
    transform: scale(0);
}

.btn:hover .tip-container {
    opacity: 1;
    transform: scale(1);
}

.tip {
    width: 100%;
    border: 2px solid gray;
    padding: 1px 3px;
    border-radius: 5px;
}

.tip::before {
    content: "";
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-right: 5px solid gray;
}
</style>
<script setup>
import { defineComponent } from "vue";
</script>
<script>
export default defineComponent({
    props: {
        tip: {
            type: String,
            default: ""
        }
    }
});
</script>