<template>
    <Draggable>
        <div class="node">
            <div class="title-bar" data-region :data-node="node.name">
                <div ref="in" class="in point"></div>
                <span class="margin5 right">{{ myLabelType }}</span>
                <PrimaryButton @click="$emit('remove')" class="remove-btn" data-no-region>移除</PrimaryButton>
                <PrimaryButton @click="$emit('clone')" class="clone-btn" data-no-region>克隆</PrimaryButton>
            </div>
            <div class="content">
                <div v-if="node.type === 'talk'">
                    说话者：<br>
                    <Selector wide v-model="node.data.talker" :options="keyMirror(characters)" /><br>
                    说话者情绪：<br>
                    <Selector wide v-model="node.data.feeling" :options="keyMirror(feelings)" /><br>
                    内容：<br>
                    <input v-model="node.data.content">
                </div>
                <div v-if="node.type === 'select'">
                    说话者：<br>
                    <Selector wide v-model="node.data.talker" :options="keyMirror(characters)" /><br>
                    说话者情绪：<br>
                    <Selector wide v-model="node.data.feeling" :options="keyMirror(feelings)" /><br>
                    内容：<br>
                    <input class="wide" v-model="node.data.content"><br>
                    选项：
                    <PrimaryButton @click="addOption">添加</PrimaryButton>
                    <div class="options">
                        <div v-for="option, index in node.data.options" :key="index" class="option">
                            <input class="margin5 right" v-model="option.label" placeholder="选项内容...">
                            <PrimaryButton class="remove-btn" @click="removeOption(index)">移除</PrimaryButton>
                            <div class="out point with-anchor" :ref="'outPoint'"
                                @mousedown="startConnect($event, index)"></div>
                        </div>
                        <span v-if="!node.data.options.length">并没有添加任何选项！</span>
                    </div>
                </div>
                <div v-if="node.type === 'image'">
                    <img v-if="node.data.src && previewing"
                        :src="assetDatas[assetNames.indexOf(node.data.src)].dataUrl"><br>
                    <Selector wide v-model="node.data.src"
                        :options="keyMirror(assetNames.filter(name => assetDatas[assetNames.indexOf(name)].type === 'image'))" />
                    <br>
                    <WideButton superwide @click="previewing = !previewing">预览：{{ previewing ? '开' : '关' }}</WideButton>
                </div>
                <div v-if="node.type === 'video'">
                    <video v-if="node.data.src && previewing"
                        :src="assetDatas[assetNames.indexOf(node.data.src)].dataUrl" controls></video><br>
                    <Selector wide v-model="node.data.src"
                        :options="keyMirror(assetNames.filter(name => assetDatas[assetNames.indexOf(name)].type === 'video'))" />
                    <br>
                    <WideButton superwide @click="previewing = !previewing">预览:{{ previewing ? '开' : '关' }}</WideButton>
                </div>
                <div v-if="node.type === 'script'">
                    脚本ID：
                    <Selector v-model="node.data.scriptId" :options="keyMirror(scripts)" />
                </div>
            </div>
            <div v-if="node.type !== 'select'" ref="out" @mousedown="startConnect" class="out point"></div>
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

.name {
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

.point:hover {
    background-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.out.point {
    position: absolute;
    right: 5px;
    bottom: 5px;
}

.out.point.with-anchor {
    position: relative;
    right: unset;
    bottom: unset;
    margin-left: 5px;
}

.in.point {
    position: relative;
    display: inline-block;
    margin: 0 5px;
}

.options {
    border: 2px solid gray;
    padding: 5px;
    display: flex;
    flex-direction: column;
}

.options .option {
    padding: 3px 6px;
    display: flex;
    align-items: center;
}

.options .option:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.remove-btn {
    margin-left: auto;
}

.clone-btn {
    margin-left: 5px;
}
</style>
<script setup lang="ts">
import Draggable from "./Draggable.vue";
import { Drawing, keyMirror } from "../tools";
import Selector from "./Selector.vue";
import { AssetDescriptor, ScriptNode, ScriptNodeNext, ScriptNodeType } from "src/types/structs";
import PrimaryButton from "./PrimaryButton.vue";
import { PropType } from "vue";
import WideButton from "./WideButton.vue";
</script>
<script lang="ts">
export default {
    props: {
        node: {
            type: Object as PropType<ScriptNode>,
            required: true
        },
        finder: {
            type: Function as PropType<(name: string | null) => ScriptNodeNext | null>,
            required: true
        },
        updaterRegister: {
            type: Function,
            required: true
        },
        forceUpdater: {
            type: Function,
            required: true
        },
        characters: {
            type: Array<string>,
            required: true
        },
        feelings: {
            type: Array<string>,
            required: true
        },
        scripts: {
            type: Array<string>,
            required: true
        },
        assetNames: {
            type: Array as PropType<string[]>,
            required: true
        },
        assetDatas: {
            type: Object as PropType<AssetDescriptor[]>,
            required: true
        }
    },
    mounted() {
        this.updaterRegister(() => {
            if (this.node.type === "select") {
                this.node.data.options.forEach((option, index) => {
                    if (index === this.connectingLabelIndex) return;
                    const nextNode = this.finder(option.next);
                    if (nextNode) {
                        Drawing.bezierConnectElement(
                            (this.$refs.outPoint as HTMLDivElement[])[index],
                            nextNode.el.querySelector(".in.point") as HTMLElement
                        );
                    };
                });
            };
            if (this.amIConnecting) {
                if (this.node.type === "select") {
                    Drawing.bezierConnectElement(
                        (this.$refs.outPoint as HTMLDivElement[])[this.connectingLabelIndex],
                        this.mouseElement
                    );
                } else {
                    Drawing.bezierConnectElement(this.$refs.out as HTMLDivElement, this.mouseElement);
                };
            } else if (this.node.type !== "select" && this.myNext) {
                const { nextPointElement } = this;
                if (!nextPointElement) return;
                Drawing.bezierConnectElement(this.$refs.out as HTMLDivElement, nextPointElement, "center");
            };
        });
        window.addEventListener("mouseup", (e) => {
            if (!this.amIConnecting) return;
            if (
                e.target
                && e.target instanceof HTMLElement
                && e.target.matches(".node [data-node] *, .node [data-node]")
            ) {
                const targetNode = this.finder(this.findNodeDataName(e.target));
                if (targetNode && targetNode.data) {
                    if (this.node.type === "select") {
                        this.node.data.options[this.connectingLabelIndex].next = targetNode.data.name;
                    } else {
                        this.node.next = targetNode.data.name;
                    };
                };
            } else {
                if (this.node.type === "select") {
                    this.node.data.options[this.connectingLabelIndex].next = null;
                } else {
                    this.node.next = null;
                };
            };
            this.endConnect();
        });
        this.$nextTick(() => this.connectFrame());
    },
    data() {
        return {
            amIConnecting: false,
            connectingLabelIndex: -1,
            previewing: false
        }
    },
    computed: {
        nextPointElement() {
            if (this.myNext) {
                return this.myNext.el.querySelector(".in.point") as HTMLElement;
            };
        },
        myLabelType() {
            const map: Record<ScriptNodeType, string> = {
                talk: "对话",
                select: "选择分支",
                image: "显示图像",
                video: "显示视频",
                script: "执行脚本"
            };
            return map[this.node.type];
        },
        mouseElement() {
            return {
                getBoundingClientRect() {
                    return {
                        left: window.mouse[0],
                        top: window.mouse[1],
                    }
                },
                clientWidth: 0,
                clientHeight: 0
            };
        },
        myNext(): ScriptNodeNext | null {
            if (this.node.type === "select") {
                return null;
            } else {
                return this.finder(this.node.next);
            };
        }
    },
    methods: {
        startConnect(e: MouseEvent, index?: number) {
            e.preventDefault();
            window.dragging = true;
            this.amIConnecting = true;
            this.connectingLabelIndex = index ?? -1;
            this.forceUpdater();
        },
        endConnect() {
            window.dragging = false;
            this.amIConnecting = false;
            this.connectingLabelIndex = -1;
            this.forceUpdater();
        },
        connectFrame() {
            if (this.amIConnecting) {
                this.forceUpdater();
            };
            requestAnimationFrame(() => this.connectFrame());
        },
        addOption() {
            this.node.data.options.push({
                label: "选项",
                next: null
            });
        },
        removeOption(index: number) {
            this.node.data.options.splice(index, 1);
        },
        findNodeDataName(ele: HTMLElement): string | null {
            const result = ele.dataset.node;
            if (result) return result;
            else {
                if (ele.parentElement) {
                    return this.findNodeDataName(ele.parentElement);
                } else {
                    return null;
                }
            };
        }
    }
};
</script>