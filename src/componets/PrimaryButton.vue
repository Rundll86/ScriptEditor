<template>
    <button class="btn">
        <slot></slot>
    </button>
</template>
<style scoped>
.btn {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 1px 5px;
    border: 1px solid gray;
    font-size: 13px;
    margin: 2px 0;
}

.btn:hover {
    background-color: rgba(0, 0, 0, 0.2);
}

.btn:disabled {
    background-color: rgba(0, 0, 0, 0.1);
    color: gray;
}
</style>