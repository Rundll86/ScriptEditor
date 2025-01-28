<template>
    <Stage ref="stage" />
    <div class="content">
        <LeftBox :states="windowState" />
    </div>
    <div class="high-layer" :style="{
        left: highLayerPosition.x + 'px',
        top: highLayerPosition.y + 'px'
    }">
        <Node v-for="node, index in nodes" :id="'node-' + node.name" :key="node.name" :node="node" :finder="findNode"
            v-model:x="node.position.x" v-model:y="node.position.y"
            :updaterRegister="(func: NodeUpdater) => updaters.push(func)" @change="updateLines"
            :forceUpdater="updateLines" :characters="characters" :feelings="feelings" :scripts="scripts"
            @remove="removeNode(index)">
        </Node>
    </div>
    <div class="higher-layer">
        <SubWindow flexdown title="添加剧本节点" :states="windowState" name="node">
            <WideButton @click="addNode('talk')">+ 普通对话框</WideButton>
            <WideButton @click="addNode('select')">+ 对话选择框</WideButton>
            <WideButton @click="addNode('image')">+ 显示图像（CG）</WideButton>
            <WideButton @click="addNode('video')">+ 显示视频（过场动画）</WideButton>
            <WideButton @click="addNode('script')">+ 脚本执行</WideButton>
        </SubWindow>
        <SubWindow title="角色管理" :states="windowState" name="character">
            角色列表：<WideButton @click="addCharacter">+ 添加角色</WideButton>
            <div class="options">
                <div class="option" v-for="_, index in characters" :key="index">
                    <input v-model="characters[index]" class="margin5 right" placeholder="角色名称...">
                    <PrimaryButton @click="removeCharacter(index)">移除</PrimaryButton>
                </div>
                <span v-if="!characters.length">没有创建任何角色！</span>
            </div>
            心情条目：<WideButton @click="addFeeling">+ 添加心情</WideButton>
            <div class="options">
                <div class="option" v-for="_, index in feelings" :key="index">
                    <input v-model="feelings[index]" class="margin5 right" placeholder="心情名称...">
                    <input v-model="feelingMaps[index]" class="margin5 right" placeholder="对应映射ID...">
                    <PrimaryButton @click="removeFeeling(index)">移除</PrimaryButton>
                </div>
                <span v-if="!feelings.length">没有创建任何心情！</span>
            </div>
        </SubWindow>
        <SubWindow title="脚本管理" :states="windowState" name="script">
            <div class="options">
                <div class="option" v-for="_, index in scripts" :key="index">
                    <input v-model="scripts[index]" class="margin5 right" placeholder="脚本名称...">
                    <PrimaryButton @click="removeScript(index)">移除</PrimaryButton>
                </div>
                <span v-if="!scripts.length">没有创建任何脚本！</span>
            </div>
            <WideButton @click="addScript">+ 添加脚本</WideButton>
        </SubWindow>
        <SubWindow title="资源管理" :states="windowState" name="asset">
            <div class="options">
                <div class="option" v-for="_, index in assetNames" :key="index">
                    <img :src="assetDatas[index].dataUrl" class="margin5 right asset"
                        v-if="assetDatas[index].type === 'image' && assetDatas[index].previewing" />
                    <video :src="assetDatas[index].dataUrl" class="margin5 right asset"
                        v-if="assetDatas[index].type === 'video' && assetDatas[index].previewing"></video>
                    <span v-if="!assetDatas[index].data">（空资源）</span>
                    <input v-model="assetNames[index]" class="margin5 right" placeholder="资源名称...">
                    <Selector class="margin5 right" v-model="assetDatas[index].type" :options="{
                        '图片': 'image',
                        '视频': 'video'
                    }" />
                    <PrimaryButton class="margin5 right" @click="updateUpload(index)">上传资源</PrimaryButton>
                    <PrimaryButton class="margin5 right"
                        @click="assetDatas[index].previewing = !assetDatas[index].previewing">预览</PrimaryButton>
                    <PrimaryButton @click="removeAsset(index)">移除</PrimaryButton>
                </div>
                <span v-if="!assetNames.length">没有上传任何资源！</span>
            </div>
            <WideButton @click="addAsset">+ 上传资源</WideButton>
        </SubWindow>
        <SubWindow flexdown title="项目" :states="windowState" name="project">
            <input class="wide" type="text" v-model="project.name" placeholder="项目名称" />
            项目中的无效内容：
            <div class="options">
                <div v-for="content, index in Object.keys(invalidContents)" :key="index">
                    <span>{{ jargon(content) }}：</span>
                    <div class="options">
                        <div v-for="asset in invalidContents[content]" class="option">
                            {{ content === "assets" ? "空资源×1" : asset || "无效或空名称×1" }}
                        </div>
                        <span v-if="!invalidContents[content].length">（无）</span>
                    </div>
                </div>
            </div>
            无效资源不会被打包，请先处理无效资源。<br>
            <WideButton>保存项目</WideButton>
            <WideButton>从电脑加载项目</WideButton>
        </SubWindow>
        <SubWindow center title="关于" :states="windowState" name="about">
            ScriptEditor是一个基于界面的RPG/AVG游戏剧本设计器。<br>
            <div class="inline-left">
                &lt;技术栈&gt; Vue3+Webpack<br>
                &lt;开源许可&gt; MIT<br>
                &lt;仓库&gt; <a href="https://github.com/Rundll86/ScriptEditor" target="_blank">Github</a>
            </div><br>
            [[ 特别鸣谢 ]]<br>
            <Member name="FallingShrimp" alias="陨落基围虾" website="https://rundll86.github.io" />
            <Member name="Cyberexplorer" alias="赛博猫猫" website="https://lanwywritexu.github.io" />
            <Member circle name="SolariiX" alias="为每块屏幕创造精彩" website="https://solariix.com" />
        </SubWindow>
    </div>
</template>
<style scoped>
.high-layer {
    z-index: -1;
    position: absolute;
    left: 0;
    top: 0;
    transition: none;
}

.higher-layer {
    z-index: 10;
    position: absolute;
    left: 0;
    top: 0;
}

.args {
    overflow-y: auto;
    max-height: 70vh;
    border: 1px solid gray;
    margin-bottom: 10px;
}

.tip {
    display: block;
    text-align: center;
    margin: 5px;
}

.tip.error {
    color: red;
}

.tip.ok {
    color: green;
}

.tip.loading {
    color: black;
}

.tip.unknown {
    color: blueviolet;
}

.config-bar {
    display: flex;
    align-items: center;
    margin: 5px 0;
}

.config-bar>* {
    margin-left: 5px;
}

.projs {
    display: flex;
    flex-direction: column;
}

.projs>.btn {
    margin: 5px;
}

.inline-left {
    width: fit-content;
    text-align: left;
    display: inline-block;
    margin: 10px 0;
}

a:link,
a:visited {
    color: rgb(30, 144, 255);
    text-decoration: none;
}

a:hover,
a:active {
    text-decoration: underline;
}

.options {
    border: 2px solid gray;
    padding: 5px;
    display: flex;
    flex-direction: column;
    overflow: auto;
    max-height: 40vh;
}

.options .option {
    padding: 3px 6px;
    display: flex;
    align-items: center;
}

.options .option:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.options .remove-btn {
    margin-left: auto;
}

.asset {
    width: 70px;
}
</style>
<script setup lang="ts">
import LeftBox from "./LeftBox.vue";
import SubWindow from "./SubWindow.vue";
import WideButton from "./WideButton.vue";
import Member from "./Member.vue";
import Stage from "./Stage.vue";
import { Drawing } from "../tools";
import { NodeUpdater, ScriptNode, ScriptNodeNext, ScriptNodeType, Vector } from "../types/structs";
import Node from "./Node.vue";
import PrimaryButton from "./PrimaryButton.vue";
import Selector from "./Selector.vue";
</script>
<script lang="ts">
export default {
    mounted() {
        window.addEventListener("resize", this.updateLines);
        (this.$refs.stage as any).$el.addEventListener("mousedown", (e: MouseEvent) => {
            if (!window.dragging) {
                e.preventDefault();
                this.draggingHighLayer = true;
            };
        });
        window.addEventListener("mouseup", e => {
            this.draggingHighLayer = false;
        });
        window.addEventListener("mousemove", e => {
            if (this.draggingHighLayer) {
                this.highLayerPosition.x += e.movementX;
                this.highLayerPosition.y += e.movementY;
                this.updateLines();
            };
        });
    },
    computed: {
        saveData() {
            return JSON.stringify({
                nodes: this.nodes
            });
        },
        invalidContents(): Record<"nodes" | "characters" | "feelings" | "scripts" | "assets", string[]> & { [key: string]: string[] } {
            const result = {
                nodes: [] as string[],
                characters: [] as string[],
                feelings: [] as string[],
                scripts: [] as string[],
                assets: [] as string[]
            };
            this.nodes.forEach(node => {
                if (node.name === "") {
                    result.nodes.push(node.name);
                };
            });
            this.characters.forEach(character => {
                if (!character.length) {
                    result.characters.push(character);
                };
            });
            this.feelings.forEach(feeling => {
                if (!feeling.length) {
                    result.feelings.push(feeling);
                };
            });
            this.scripts.forEach(script => {
                if (!script.length) {
                    result.scripts.push(script);
                };
            });
            this.assetNames.forEach((asset, index) => {
                if (!asset.length || !this.assetDatas[index].data) {
                    result.assets.push(asset);
                };
            });
            return result;
        }
    },
    data() {
        return {
            nodes: [] as ScriptNode[],
            characters: [] as string[],
            feelings: ["平静", "悲伤", "愤怒", "震惊", "恐惧", "喜悦"] as string[],
            feelingMaps: ["normal", "sad", "angry", "shocked", "afraid", "happy"] as string[],
            scripts: ["damageCurrent", "addHp", "addBullet"] as string[],
            assetNames: [] as string[],
            assetDatas: [] as {
                data: ArrayBuffer | null,
                type: string,
                previewing: boolean,
                get dataUrl(): string
            }[],
            updaters: [] as NodeUpdater[],
            windowState: {
                node: false,
                character: false,
                script: false,
                asset: false,
                project: false,
                about: false,
                activing: ""
            },
            contextMenuState: {
                project: false
            },
            project: {
                name: "未命名项目"
            },
            highLayerPosition: new Vector(0, 0),
            draggingHighLayer: false
        };
    },
    methods: {
        save() {
            console.log(this.saveData);
        },
        updateLines() {
            Drawing.clear();
            this.updaters.forEach(updater => updater());
        },
        findNode(name: string | null): ScriptNodeNext | null {
            const found = this.nodes.find(node => node.name === name) ?? null;
            if (found) {
                return {
                    data: this.nodes.find(node => node.name === name),
                    el: document.getElementById("node-" + name) as HTMLElement
                };
            } else {
                return null;
            };
        },
        generatedRandomNodeName() {
            let result = "node" + Math.floor(Math.random() * 1000000);
            while (this.findNode(result)) { result = "node" + Math.floor(Math.random() * 1000000); };
            return result;
        },
        addNode(type: ScriptNodeType) {
            this.nodes.push({
                name: this.generatedRandomNodeName(),
                type,
                position: new Vector(-this.highLayerPosition.x + window.innerWidth / 2, -this.highLayerPosition.y + window.innerHeight / 2),
                next: null,
                data: {
                    options: []
                }
            })
        },
        addCharacter() {
            this.characters.push("");
        },
        removeCharacter(index: number) {
            this.characters.splice(index, 1);
        },
        addFeeling() {
            this.feelingMaps.push("");
            this.feelings.push("");
        },
        removeFeeling(index: number) {
            this.feelings.splice(index, 1);
            this.feelingMaps.splice(index, 1);
        },
        removeNode(index: number) {
            this.nodes.forEach(node => {
                if (node.type === "select") {
                    node.data.options.forEach(option => {
                        if (option.next === this.nodes[index].name) {
                            option.next = null;
                        };
                    });
                } else {
                    if (node.next === this.nodes[index].name) {
                        node.next = null;
                    };
                };
            });
            this.nodes.splice(index, 1);
            this.updaters.splice(index, 1);
            this.updateLines();
        },
        addScript() {
            this.scripts.push("");
        },
        removeScript(index: number) {
            this.scripts.splice(index, 1);
        },
        async addAsset() {
            this.assetDatas.push({
                data: null,
                type: "image",
                previewing: false,
                get dataUrl() {
                    if (this.data) {
                        return URL.createObjectURL(new Blob([this.data]));
                    } else {
                        return "";
                    };
                }
            });
            this.assetNames.push("");
        },
        removeAsset(index: number) {
            this.assetNames.splice(index, 1);
            this.assetDatas.splice(index, 1);
        },
        async uploadFile() {
            return new Promise<ArrayBuffer>(resolve => {
                const input = document.createElement("input");
                input.type = "file";
                input.addEventListener("change", () => {
                    const file = input.files?.[0];
                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                        resolve(reader.result as ArrayBuffer);
                    });
                    reader.readAsArrayBuffer(file as File);
                });
                input.click();
            });
        },
        async updateUpload(index: number) {
            this.assetDatas[index].data = await this.uploadFile();
        },
        jargon(key: string) {
            const map: Record<string, string> = {
                node: "节点",
                character: "角色",
                feeling: "心情",
                script: "脚本",
                asset: "资源"
            };
            const mapWithS: Record<string, string> = {};
            Object.keys(map).forEach(key => {
                mapWithS[key + "s"] = map[key];
            });
            return map[key] ?? mapWithS[key] ?? key;
        }
    }
}
</script>