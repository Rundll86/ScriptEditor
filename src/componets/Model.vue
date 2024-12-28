<template>
    <div v-if="visible" class="modal-overlay" @click="visible = false">
        <span>{{ title }}</span>
        <div class="modal-content">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Modal',
    props: {
        initialVisible: Boolean,
        title: String
    },
    data() {
        return {
            visible: this.initialVisible
        }
    }
}
</script>
<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>