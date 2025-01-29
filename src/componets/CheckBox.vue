<template>
    <span :class="{
        checked: isChecked
    }" @click="toggle"></span>
</template>
<style scoped>
span {
    width: 10px;
    height: 10px;
    position: relative;
    display: inline-block;
    border: 1px solid black;
    margin: 0 5px;
}

span::before {
    content: "";
    display: block;
    background-color: transparent;
    position: absolute;
    width: 150%;
    height: 150%;
    left: -25%;
    top: -50%;
    clip-path: polygon(0 65%,
            0 45%,
            50% 70%,
            100% 0%,
            100% 30%,
            50% 100%);
}

span.checked::before {
    background-color: black;
}
</style>
<script>
export default {
    props: {
        modelValue: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        toggle() {
            this.isChecked = !this.isChecked;
        }
    },
    watch: {
        isChecked() {
            this.$emit("update:modelValue", this.isChecked);
        }
    },
    data() {
        return {
            isChecked: this.modelValue
        }
    }
}
</script>