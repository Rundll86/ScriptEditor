<template>
    <div class="container">
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
        <div :class="{
            options: true,
            open: opening
        }">
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
<script setup>
import ToolBoxButton from "./ToolBoxButton.vue";
</script>
<script>
export default {
    props: {
        options: {
            type: Object,
            default: () => ({ option1: "a", option2: "b" })
        },
        modelValue: {
            type: String,
            default: ""
        },
        option: {
            type: String,
            default: ""
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
        select(option) {
            this.selected = option;
            this.opening = false;
        }
    },
    watch: {
        selected() {
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
    vertical-align: top;
    border: 1px solid gray;
    position: relative;
}

.option {
    padding: 0 10px;
    text-align: center;
}

.options {
    overflow: auto;
    height: 0;
}

.options.open {
    height: auto;
    max-height: 50vh;
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

.searcher {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid gray;
    width: 70px;
    margin-right: 5px;
}
</style>