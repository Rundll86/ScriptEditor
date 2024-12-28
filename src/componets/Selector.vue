<template>
    <div class="container">
        <div :class="{
            show: true,
            open: opening
        }">
            <div class="title">{{ selected }}</div>
            <ToolBoxButton class="open" @click="opening = !opening">
                {{ opening ? "▼" : "▶" }}
            </ToolBoxButton>
        </div>
        <div :class="{
            options: true,
            open: opening
        }">
            <div v-for="option in options" class="option" :key="option" @click="select(option)">
                <span :class="{
                    state: true,
                    selected: option === selected
                }">
                    {{ option }}
                </span>
            </div>
        </div>
    </div>
</template>
<script setup>
import ToolBoxButton from './ToolBoxButton.vue';
</script>
<script>
export default {
    props: {
        options: {
            type: Array,
            default: []
        },
        modelValue: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            /**
             * @type {string}
             */
            selected: this.options.includes(this.modelValue) ? this.modelValue : this.options[0],
            opening: false
        };
    },
    methods: {
        select(option) {
            this.selected = option;
            this.opening = false;
        }
    },
    watch: {
        selected() {
            this.$emit('update:modelValue', this.selected);
        }
    }
}
</script>
<style scoped>
.container {
    display: inline-block;
    vertical-align: top;
}

.option {
    padding: 0 10px;
    text-align: center;
}

.options {
    overflow: hidden;
    height: 0;
}

.options.open {
    height: auto;
}

.title {
    text-align: center;
    flex-grow: 1;
}

.show {
    display: flex;
    align-items: center;
}

.show.open {
    background-color: rgba(0, 0, 0, 0.05);
}

.open {
    margin-left: auto;
}

.option:hover {
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
}

.state::before {
    content: "[";
    color: transparent;
    margin-right: 10px;
}

.state::after {
    content: "]";
    color: transparent;
    margin-left: 10px;
}

.state.selected::before {
    color: black;
}

.state.selected::after {
    color: black;
}
</style>