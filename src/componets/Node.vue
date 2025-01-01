<template>
    <Draggable>
        <div class="node" :data-is-entry="node.isEntry">
            <div class="title-bar" data-region :data-node="node.name">
                <div ref="in" :data-node="node.name" class="in point" v-if="!node.isEntry"></div>
                {{ node.isEntry ? '入口' : '方法' }}：{{ node.name }}
            </div>
            <div class="content">
                节点名称：
                <input v-model="node.name" class="name">
                <div v-if="!node.isEntry">
                    调用方法名：
                    <Selector :options="keyMirror(...windowKeys)" />
                </div>
                <div v-if="node.isEntry">
                    入口节点不能调用方法。
                </div>
            </div>
            <div ref="out" @mousedown="startConnect" class="out point"></div>
        </div>
    </Draggable>
</template>
<style scoped>
.node {
    border: 1px solid gray;
    min-width: 200px;
    position: relative;
    background-color: rgba(0, 0, 0, 0.05);
}

.node * {
    text-wrap: nowrap;
}

.title-bar {
    display: flex;
    align-items: center;
    padding: 5px;
    border-bottom: 1px solid gray;
    background-color: rgba(0, 0, 0, 0.1);
}
.name{
    margin: 5px 0;
}
.content {
    padding: 20px;
}

.point {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid gray;
}

.out.point {
    position: absolute;
    right: 5px;
    bottom: 5px;
}

.in.point {
    position: relative;
    display: inline-block;
    margin: 0 5px;
}
</style>
<script setup>
import Draggable from './Draggable.vue';
import { Drawing, keyMirror } from '../tools';
import Selector from './Selector.vue';
</script>
<script>
export default {
    props: {
        node: Object,
        finder: Function,
        updaterRegister: Function,
        forceUpdater: Function
    },
    mounted() {
        this.myNext = this.finder(this.node.next);
        this.updaterRegister(() => {
            if (this.amIConnecting) {
                Drawing.bezierConnectElement(this.$refs.out, {
                    getBoundingClientRect() {
                        return {
                            left: window.mouse[0],
                            top: window.mouse[1],
                        }
                    },
                    clientWidth: 0,
                    clientHeight: 0
                });
            } else if (this.myNext) {
                Drawing.bezierConnectElement(this.$refs.out, this.nextPointElement, "center");
            };
        });
        window.addEventListener("mouseup", (e) => {
            if (this.amIConnecting) {
                if (e.target.matches(".node[data-is-entry=false] [data-node]")) {
                    const node = this.finder(e.target.dataset.node);
                    if (node) {
                        this.node.next = node.data.name;
                        this.myNext = node;
                    };
                } else {
                    this.node.next = null;
                    this.myNext = null;
                };
                this.endConnect();
            };
        });
        this.$nextTick(() => this.connectFrame());
    },
    data() {
        return {
            myNext: null,
            amIConnecting: false
        }
    },
    computed: {
        nextPointElement() {
            return this.myNext.el.querySelector('.in.point')
        },
        windowKeys() {
            return Object.keys(window).filter(key => (
                !key.includes("__VUE_")
                && !key.includes("webpack")
                && !key.includes("devtool")
                && window[key] instanceof Function
            ));
        }
    },
    methods: {
        startConnect(e) {
            e.preventDefault();
            this.amIConnecting = true;
            this.forceUpdater();
        },
        endConnect() {
            this.amIConnecting = false;
            this.forceUpdater();
        },
        connectFrame() {
            if (this.amIConnecting) {
                this.forceUpdater();
            };
            requestAnimationFrame(() => this.connectFrame());
        }
    }
};
</script>