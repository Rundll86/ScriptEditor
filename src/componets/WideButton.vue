<template>
    <button :class="{
        btn: true,
        superwide
    }">
        <slot></slot>
    </button>
</template>
<style scoped>
.btn {
    min-width: 30px;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 2px 5px;
    margin: 3px;
    border: 1px solid gray;
}

.btn.superwide {
    width: 100%;
    margin: 0;
    margin: 3px 0;
}

.btn:hover {
    background-color: rgba(0, 0, 0, 0.2);
}

.btn:disabled {
    background-color: rgba(0, 0, 0, 0.1);
    color: gray;
}
</style>
<script setup>
import { defineComponent } from "vue";
</script>
<script>
export default defineComponent({
    props: {
        superwide: Boolean
    }
})
</script>