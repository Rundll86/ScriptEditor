<template>
    <div class="root">
        <img :src="`./img/${name}.jpg`" class="avatar">
        <span class="name">{{ name }}</span>
        <span class="des">{{ des }}</span>
    </div>
</template>
<script>
export default {
    props: {
        name: {
            type: String,
            default: "UnknownMember"
        },
        des: {
            type: String,
            default: "Description"
        }
    }
}
</script>
<style scoped>
.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.name {
    font-weight: bold;
    font-size: 18px;
    margin-top: 5px;
}

.des {
    margin-top: 5px;
}

.root {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 15px;
}
</style>