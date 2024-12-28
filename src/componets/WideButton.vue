<template>
    <button class="btn">
        <slot></slot>
    </button>
</template>
<style scoped>
.btn {
    min-width: 30px;
    height: 30px;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 4px 9px;
    margin-left: 0 3px;
    border: 1px solid gray;
}

.btn:hover {
    background-color: rgba(0, 0, 0, 0.2);
}
</style>