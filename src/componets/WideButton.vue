<template>
    <button class="btn">
        <slot></slot>
    </button>
</template>
<style scoped>
.btn {
    min-width: 30px;
    height: 30px;
    background-color: transparent;
    padding: 3px 8px;
    border-radius: 5px;
    margin: 0px 5px;
}

.btn:hover {
    background-color: rgba(0, 0, 0, 0.1);
}
</style>