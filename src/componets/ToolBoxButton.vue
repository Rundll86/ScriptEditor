<template>
    <button class="btn">
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
}

.btn:hover {
    background-color: rgba(0, 0, 0, 0.1);
}
</style>