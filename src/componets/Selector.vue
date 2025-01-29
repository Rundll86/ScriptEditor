<template>
    <div class="container" :class="{ wide }">
        <div :class="{
            show: true,
            open: opening
        }">
            <div class="title">{{ optionName }}</div>
            <ToolBoxButton class="open" @click="opening = !opening">
                {{ opening ? "▼" : "▶" }}
            </ToolBoxButton>
            <ToolBoxButton class="open" @click="searching = !searching; searching || (searchText = '')">
                <span class="fa fa-search"></span>
            </ToolBoxButton>
            <input type="text" class="searcher" v-model="searchText" v-if="searching">
        </div>
        <div class="options" v-if="opening">
            <div v-for="option in Object.keys(options)" :key="option">
                <div class="option" v-if="option.includes(searchText)" :key="option" @click="select(options[option])">
                    <span :class="{
                        state: true,
                        selected: options[option] === selected
                    }">
                        {{ option }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { PropType } from "vue";
import ToolBoxButton from "./ToolBoxButton.vue";
</script>
<script lang="ts">
export default {
    mounted() {
        this.$nextTick(() => {
            this.select(this.selected);
        });
    },
    props: {
        options: {
            type: Object,
            default: () => ({ option1: "a", option2: "b", option3: "c" })
        },
        modelValue: {
            type: null
        },
        option: {
            type: String,
            default: ""
        },
        wide: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            /**
             * @type {string}
             */
            selected: Object.values(this.options).includes(this.modelValue) ? this.modelValue : Object.values(this.options)[0],
            opening: false,
            searching: false,
            searchText: ""
        };
    },
    methods: {
        select(option: any) {
            this.selected = option;
            this.opening = false;
            this.$emit("update:modelValue", this.selected);
            this.$emit("update:option", this.optionName);
        }
    },
    computed: {
        optionName() {
            return Object.keys(this.options)[Object.values(this.options).findIndex(value => value === this.selected)];
        }
    }
}
</script>
<style scoped>
.container {
    display: inline-block;
    border: 1px solid gray;
    position: relative;
    box-sizing: border-box;
}

.container.wide {
    width: 100%;
}

.option {
    padding: 0 10px;
    text-align: center;
}

.options {
    overflow: auto;
    max-height: 40vh;
}

.title {
    text-align: center;
    flex-grow: 1;
    margin: 0 5px;
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

.searcher {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid gray;
    width: 70px;
    margin-right: 5px;
}
</style>