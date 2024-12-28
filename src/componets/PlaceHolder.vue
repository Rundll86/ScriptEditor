<template>
    <div :style="{
        height: height + 'px'
    }"></div>
</template>
<script>
export default {
    props: {
        height: String
    }
}
</script>