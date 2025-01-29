<template>
    <div class="root">
        <img :src="`./img/${name}.jpg`" :class="{
            avatar: true,
            border: withBorder
        }">
        <span class="name">{{ name + (team ? "(Team)" : "") }}</span>
        <a :href="website" target="_blank" class="alias smallfont">
            - {{ alias }}
            {{ website ? "[↗]" : "" }}
        </a>
    </div>
</template>
<script setup lang="ts">
import { defineComponent } from "vue";
</script>
<script lang="ts">
export default defineComponent({
    props: {
        name: {
            type: String,
            default: "UnknownMember"
        },
        alias: {
            type: String,
            default: "MemberAlias"
        },
        website: String,
        withBorder: Boolean,
        team: Boolean
    }
});
</script>
<style scoped>
.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.avatar.border {
    border: 2px solid gray;
}

.smallfont {
    font-size: 14px;
}

.name {
    font-weight: bold;
    font-size: 18px;
    margin-top: 5px;
}

.alias {
    margin-top: 5px;
    color: rgba(0, 0, 0, 0.5);
}

a:link,
a:visited {
    text-decoration: none;
}

a:hover,
a:active {
    color: rgba(0, 0, 0, 0.75);
    text-decoration: underline;
}

.root {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 15px;
}
</style>