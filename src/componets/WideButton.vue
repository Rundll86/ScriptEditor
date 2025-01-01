<template>
    <button class="btn">
        <slot></slot>
    </button>
</template>
<style scoped>
.btn {
    min-width: 30px;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 2px 5px;
    margin: 0 3px;
    border: 1px solid gray;
}

.btn:hover {
    background-color: rgba(0, 0, 0, 0.2);
}

.btn:disabled {
    background-color: rgba(0, 0, 0, 0.1);
    color: gray;
}
</style>