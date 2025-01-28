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
            :assetNames="assetNames" :assetDatas="assetDatas" @remove="removeNode(index)" @clone="cloneNode(index)" />
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
                    <PrimaryButton class="margin-auto left" @click="removeCharacter(index)">移除</PrimaryButton>
                </div>
                <span v-if="!characters.length">没有创建任何角色！</span>
            </div>
            心情条目：<WideButton @click="addFeeling">+ 添加心情</WideButton>
            <div class="options">
                <div class="option" v-for="_, index in feelings" :key="index">
                    <input v-model="feelings[index]" class="margin5 right" placeholder="心情名称...">
                    <input v-model="feelingMaps[index]" class="margin5 right" placeholder="对应映射ID...">
                    <PrimaryButton class="margin-auto left" @click="removeFeeling(index)">移除</PrimaryButton>
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
            <div style="text-align: center">
                <WideButton @click="downloadFile(JSON.stringify(projectData[targetSaver]), `${targetSaver}.json`)">独立编译
                </WideButton>
                <Selector v-model="targetSaver" style="vertical-align: revert;"
                    :options="keyMapper(Object.keys(invalidContents).map(e => jargon(e) + '数据'), Object.keys(invalidContents))" />
            </div>
            <WideButton @click="downloadFile(JSON.stringify(projectData), 'project.json')">保存整个项目</WideButton>
            <WideButton @click="loadProject">从电脑加载项目</WideButton>
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
    min-height: 15vh;
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
import { Drawing, keyMapper } from "../tools";
import { AssetDescriptor, NodeUpdater, ScriptAssetGenerated, ScriptNode, ScriptNodeGenerated, ScriptNodeNext, ScriptNodeType, SelectOption, Vector } from "../types/structs";
import Node from "./Node.vue";
import PrimaryButton from "./PrimaryButton.vue";
import Selector from "./Selector.vue";
</script>
<script lang="ts">
type AcceptType = {
    dataurl: string,
    arraybuffer: ArrayBuffer,
    text: string
}
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
        },
        projectData() {
            const result: Record<"nodes" | "characters" | "feelings" | "scripts" | "assets", any> & { [key: string]: any } = {
                nodes: {} as Record<string, ScriptNodeGenerated>,
                characters: [...this.characters],
                feelings: {} as Record<string, string>,
                scripts: [...this.scripts],
                assets: {} as Record<string, ScriptAssetGenerated>
            };
            this.nodes.forEach(node => {
                const current: ScriptNodeGenerated = {
                    type: node.type,
                    jumpTo: node.next,
                    position: node.position
                };
                if (node.type === "talk" || node.type === "select") {
                    current.output = node.data.talker;
                    current.emoji = node.data.feeling;
                    current.content = node.data.content;
                } else if (node.type === "image" || node.type === "video") {
                    current.src = node.data.src;
                } else if (node.type === "script") {
                    current.scriptId = node.data.scriptId;
                };
                if (node.type === "select") {
                    current.options = node.data.options.map(e => ({
                        label: e.label,
                        jumpTo: e.next ?? "#"
                    }));
                };
                result.nodes[node.name] = current;
            });
            this.feelings.forEach((feeling, index) => {
                result.feelings[feeling] = this.feelingMaps[index];
            });
            this.assetNames.forEach((asset, index) => {
                if (!this.assetDatas[index].data) return;
                result.assets[asset] = {
                    data: this.arrayBufferToBase64(this.assetDatas[index].data),
                    type: this.assetDatas[index].type
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
            assetDatas: [] as AssetDescriptor[],
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
            draggingHighLayer: false,
            targetSaver: ""
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
                position: new Vector(
                    -this.highLayerPosition.x + Math.floor(window.innerWidth / 2 * Math.random()),
                    -this.highLayerPosition.y + Math.floor(window.innerHeight / 2 * Math.random())
                ),
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
        cloneNode(index: number) {
            const node = this.nodes[index];
            this.addNode(node.type);
            const newNode = this.nodes[this.nodes.length - 1];
            newNode.position = node.position.translated(new Vector(350, 0));
            newNode.data = JSON.parse(JSON.stringify(node.data));
            if (!node.next && node.type !== "select") {
                this.$nextTick(() => {
                    node.next = newNode.name;
                    this.updateLines();
                });
            };
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
        async readFile<T extends keyof AcceptType>(file: File, target: T = "arraybuffer" as T): Promise<AcceptType[T]> {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.addEventListener("load", () => {
                    if (reader.result) resolve(reader.result as AcceptType[T]);
                    else reject(null);
                });
                reader.addEventListener("error", () => {
                    reject(null);
                });
                if (target === "dataurl") {
                    reader.readAsDataURL(file);
                } else if (target === "arraybuffer") {
                    reader.readAsArrayBuffer(file);
                } else if (target === "text") {
                    reader.readAsText(file);
                };
            });
        },
        async uploadFile<T extends keyof AcceptType>(target: T = "arraybuffer" as T) {
            return new Promise<AcceptType[T]>(resolve => {
                const input = document.createElement("input");
                input.type = "file";
                input.addEventListener("change", async () => {
                    const file = input.files?.[0];
                    if (file) {
                        resolve(await this.readFile(file, target));
                    };
                });
                input.click();
            });
        },
        downloadFile(content: any, filename: string = "something") {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([content]));
            a.download = filename;
            a.click();
        },
        async updateUpload(index: number) {
            this.assetDatas[index].data = await this.uploadFile("arraybuffer");
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
        },
        arrayBufferToBase64(buffer: ArrayBuffer) {
            let binary = '';
            const bytes = new Uint8Array(buffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            };
            return btoa(binary);
        },
        base64ToArrayBuffer(base64: string) {
            const binaryString = window.atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        },
        async loadProject() {
            this.reconstructOriginalData(JSON.parse(await this.uploadFile("text")));
            this.$nextTick(() => this.updateLines());
        },
        reconstructOriginalData(projectData: typeof this.projectData) {
            const originalData = {
                nodes: [] as ScriptNode[],
                characters: [] as string[],
                feelings: [] as string[],
                feelingMaps: [] as string[],
                scripts: [] as string[],
                assetNames: [] as string[],
                assetDatas: [] as AssetDescriptor[]
            };
            for (const nodeName in projectData.nodes) {
                const node = projectData.nodes[nodeName];
                const originalNode: ScriptNode = {
                    name: nodeName,
                    next: node.jumpTo || null,
                    position: node.position,
                    type: node.type,
                    data: {
                        options: node.options?.map((e: SelectOption) => ({
                            label: e.label,
                            next: e.jumpTo
                        })) ?? []
                    }
                };
                if (node.type === "talk" || node.type === "select") {
                    originalNode.data.talker = node.output;
                    originalNode.data.feeling = node.emoji;
                    originalNode.data.content = node.content;
                } else if (node.type === "image" || node.type === "video") {
                    originalNode.data.src = node.src;
                } else if (node.type === "script") {
                    originalNode.data.scriptId = node.scriptId;
                };
                originalData.nodes.push(originalNode);
            };
            originalData.characters = projectData.characters;
            originalData.feelings = Object.keys(projectData.feelings);
            originalData.feelingMaps = Object.values(projectData.feelings);
            originalData.scripts = projectData.scripts;
            for (const assetName in projectData.assets) {
                const asset = projectData.assets[assetName];
                originalData.assetNames.push(assetName);
                originalData.assetDatas.push({
                    data: this.base64ToArrayBuffer(asset.data),
                    type: asset.type,
                    previewing: false,
                    get dataUrl() {
                        if (this.data) {
                            return URL.createObjectURL(new Blob([this.data]));
                        } else {
                            return "";
                        };
                    }
                });
            };
            this.updaters = [];
            this.nodes = originalData.nodes;
            this.characters = originalData.characters;
            this.feelings = originalData.feelings;
            this.feelingMaps = originalData.feelingMaps;
            this.scripts = originalData.scripts;
            this.assetNames = originalData.assetNames;
            this.assetDatas = originalData.assetDatas;
        }
    }
}
</script>