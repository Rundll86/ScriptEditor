<template>
    <div :class="{
        root: true,
        sub
    }" v-if="show">
        <div v-for="item in items" class="menu" @click="click(item)" :key="item">
            {{ item.name }}
            <ContextMenu sub
             :show="current === item.name && item.sub?.length > 0"
              :items="item.sub"
               @click.stop>
            </ContextMenu>
        </div>
    </div>
</template>
<script>
export default {
    name: "ContextMenu",
    props: {
        items: {
            type: Array,
            default: () => ([
                {
                    sub: [
                        {
                            name: "Apple",
                            sub: [
                                {
                                    name: "Red Apple"
                                },
                                {
                                    name: "Green Apple"
                                }
                            ]
                        },
                        {
                            name: "Banana",
                            sub: [
                                {
                                    name: "Yellow Banana"
                                },
                                {
                                    name: "Green Banana"
                                }
                            ]
                        }
                    ],
                    name: "Fruit"
                },
                {
                    name: "Vegetable",
                    sub: [
                        {
                            name: "Carrot"
                        },
                        {
                            name: "Potato",
                            sub: [
                                {
                                    name: "Red Potato"
                                },
                                {
                                    name: "Yellow Potato"
                                }
                            ]
                        }
                    ]
                }
            ])
        },
        show: {
            type: Boolean,
            default: false
        },
        sub: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            current: null
        }
    },
    methods: {
        click(item) {
            if (this.current === item.name) {
                this.current = null;
            } else {
                this.current = item.name;
            };
            item.click?.call(this);
        }
    }
}
</script>
<style scoped>
.root {
    display: flex;
    flex-direction: column;
    border: 1px solid gray;
    background-color: rgb(235, 235, 235);
    margin: 0 5px;
}

.menu {
    display: flex;
    align-items: center;
    position: relative;
    text-wrap-mode: nowrap;
    padding: 5px 10px;
}

.root>.menu:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.root.sub {
    position: absolute;
    left: 100%;
    top: -1px;
}
</style>