<template>
    <Stage ref="stage" />
    <div class="content">
        <LeftBox :blocks="blocks" :states="windowState" />
        <RightBox :blocks="blocks" />
    </div>
    <div class="high-layer">
        <Node v-for="node in nodes" :id="'node-' + node.name" :key="node.name" :node="node" :finder="findNode"
            v-model:x="node.position.x" v-model:y="node.position.y" :updaterRegister="(func) => updaters.push(func)"
            @change="updateLines" :forceUpdater="updateLines" />
        <SubWindow title="积木配置" :states="windowState" name="block">
            <div class="args">
                <span class="tip" v-if="parts.length === 0">
                    这个积木没有任何组件。
                </span>
                <ArgumentPart @remove="removePart" :index="index" :part="part" v-for="part, index in parts"
                    :isText="part.isText" :content="part.content" :key="index" />
            </div>
            <div class="config-bar">
                使用装饰器生成？
                <CheckBox v-model="useDecorator" class="left-auto" />
            </div>
            <div class="config-bar">
                添加组件
                <WideButton class="left-auto" @click="addText">文本</WideButton>
                <WideButton @click="addArg">参数框</WideButton>
            </div>
            <div class="config-bar">
                积木ID：
                <input style="margin-left: 10px;" v-model="blockOpcode" :disabled="disabledOpcode">
                <WideButton @click="autoOpcode">自动计算</WideButton>
            </div>
            <div class="config-bar">
                <WideButton class="left-auto" @click="saveBlock">保存</WideButton>
            </div>
        </SubWindow>
        <SubWindow title="参数加载器" :states="windowState" name="loaders">
            占位<br>
            placeholder<br>
            （还没做）<br>
        </SubWindow>
        <SubWindow title="项目" :states="windowState" name="project">
            <div class="projs">
                <WideButton @click="contextMenuState.project = true">
                    文件
                    <ContextMenu :show="contextMenuState.project" :items="[
                        {
                            name: '保存到本地',
                            click() {
                                save();
                            },
                            sub: [
                                {
                                    name: '多文件',
                                    sub: [
                                        {
                                            name: '.json+资源 - 标准格式'
                                        },
                                        {
                                            name: '.xml+.js - 数据+资源'
                                        }
                                    ]
                                },
                                {
                                    name: '单文件',
                                    sub: [
                                        {
                                            name: '.zip - 简单压缩包'
                                        },
                                        {
                                            name: '.emp - ExtMaker标准格式',
                                            sub:[
                                                {
                                                    name: '.emp - 不加密'
                                                },
                                                {
                                                    name: '.empc - 加密'
                                                }
                                            ]
                                        },
                                        {
                                            name: '.fse - 更优雅的储存方式，需要FS-Context v2'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            name: '从本地加载',
                            click() {
                                console.log('打开')
                            }
                        },
                        {
                            name: '（实验）从项目服务器加载',
                            click() {
                                console.log('load from server')
                            }
                        }
                    ]" />
                </WideButton>
                <span :class="{
                    'tip': true,
                    'error': serverState === 'error',
                    'ok': serverState === 'ok',
                    'loading': serverState === 'loading',
                    'unknown': serverState === 'unknown'
                }">{{ serverStateMap }}</span>
                <WideButton :disabled="!canUseServer">打包：原版，无需编译</WideButton>
                <WideButton :disabled="!canUseServer">打包：基于FS-Context框架</WideButton>
            </div>
        </SubWindow>
        <SubWindow title="添加节点" :states="windowState" name="node">
            <div class="projs">
                <WideButton @click="addNormalNode">普通节点</WideButton>
                <WideButton @click="addEntryNode">入口点</WideButton>
            </div>
        </SubWindow>
        <SubWindow center title="关于" :states="windowState" name="about">
            ExtMaker是一个可零基础使用的界面Scratch拓展设计器。<br>
            <div class="inline-left">
                &lt;技术栈&gt; Vue3+Webpack<br>
                &lt;开源许可&gt; MIT<br>
                &lt;仓库&gt; <a href="https://github.com/Rundll86/ExtMakerGUI" target="_blank">Github</a>
            </div><br>
            [[ 特别鸣谢 ]]<br>
            <Member name="VHS" des="创意/策划" />
            <Member name="FallingShrimp" des="界面开发" />
            <Member name="Cyberexplorer" des="美术支持" />
            <Member name="叶睿杰" des="优化建议" />
        </SubWindow>
    </div>
</template>
<style scoped>
.content {
    background-color: white;
    padding-top: 70px;
}

.high-layer {
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
</style>
<script setup>
import LeftBox from './LeftBox.vue';
import RightBox from './RightBox.vue';
import SubWindow from './SubWindow.vue';
import ArgumentPart from './ArgumentPart.vue';
import CheckBox from './CheckBox.vue';
import WideButton from './WideButton.vue';
import Member from "./Member.vue";
import Stage from './Stage.vue';
import { toRaw } from 'vue';
import md5 from 'md5';
import { Drawing } from "../tools";
import { Vector } from '../types/structs';
import Node from './Node.vue';
import ContextMenu from './ContextMenu.vue';
</script>
<script>
export default {
    mounted() {
        Drawing.initWith(this.$refs.stage.$el);
        this.$nextTick(() => {
            this.updateLines();
        });
        fetch(this.buildServerHost() + "/ping")
            .then(e => e.json())
            .then(e => {
                console.log(e);
                if (this.isValidBuildServer(e)) {
                    this.serverState = "ok"
                } else {
                    this.serverState = "unknown";
                };
            })
            .catch(() => {
                this.serverState = "error";
            });
    },
    computed: {
        serverStateMap() {
            return ({
                loading: "正在" + this.serverStateSuffix,
                ok: "已" + this.serverStateSuffix,
                error: "无法" + this.serverStateSuffix,
                unknown: "无法识别的项目服务器"
            })[this.serverState];
        },
        canUseServer() {
            return ["ok", "unknown"].includes(this.serverState);
        },
        saveData() {
            return JSON.stringify({
                blocks: this.blocks,
                nodes: this.nodes,
                currentBlock: this.currentBlock()
            });
        }
    },
    data() {
        return {
            serverStateSuffix: "连接到项目服务器",
            serverState: "loading", //loading, ok, error, unknown
            blocks: [],
            nodes: [],
            updaters: [],
            windowState: {
                block: false,
                menus: false,
                loaders: false,
                project: false,
                about: false,
                activing: ""
            },
            contextMenuState: {
                project: false,
            },
            parts: [
                {
                    content: '弹窗',
                    isText: true
                },
                {
                    content: 'something',
                    isText: false,
                    data: {
                        inputType: "String",
                        defaultValue: "一些东西",
                        loader: null,
                        menu: null
                    }
                },
                {
                    content: '到浏览器窗口',
                    isText: true
                }
            ],
            blockOpcode: "",
            disabledOpcode: false,
            useDecorator: false
        };
    },
    methods: {
        save() {
            console.log(this.saveData);
        },
        isValidBuildServer(pingMessage) {
            return (
                pingMessage.is === "em-project-server"
                && pingMessage.status === "running"
                && pingMessage.message === "pong"
            );
        },
        updateLines() {
            Drawing.clear();
            this.updaters.forEach(updater => updater());
        },
        findNode(name) {
            const found = this.nodes.find(node => node.name === name);
            if (found) {
                return {
                    data: this.nodes.find(node => node.name === name),
                    el: document.getElementById("node-" + name)
                };
            } else {
                return null;
            };
        },
        addText() {
            this.parts.push({
                content: "new text",
                isText: true
            });
        },
        addArg() {
            this.parts.push({
                content: "argName",
                isText: false,
                data: {
                    inputType: "String",
                    defaultValue: "",
                    loader: null,
                    menu: null
                }
            });
        },
        autoOpcode() {
            if (this.disabledOpcode) {
                this.disabledOpcode = false;
                this.blockOpcode = "";
            } else {
                this.disabledOpcode = true;
                this.blockOpcode = "_" + md5(this.calcBlockTextWithoutArgInfo(this.parts));
            };
        },
        saveBlock() {
            const targetWrite = this.findBlock(this.blockOpcode);
            const currentBlock = this.currentBlock();
            if (targetWrite) {
                targetWrite.parts = currentBlock.parts;
                targetWrite.useDecorator = currentBlock.useDecorator;
                targetWrite.text = currentBlock.text;
            } else {
                this.blocks.push(currentBlock);
            };
        },
        calcBlockText(parts) {
            return parts.map(part => {
                if (part.isText) {
                    return part.content;
                } else {
                    const inputType = part.data.inputType === "String" ? "" : `:${part.data.inputType.toLowerCase()}`;
                    const defaultValue = part.data.defaultValue ? `=${part.data.defaultValue}` : "";
                    return `[${part.content}${inputType}${defaultValue}]`;
                };
            }).join("");
        },
        calcBlockTextWithoutArgInfo(parts) {
            return parts.map(part => {
                if (part.isText) {
                    return part.content;
                } else {
                    return `[${part.content}]`;
                };
            }).join("");
        },
        toRawBlockData(proxiedBlock) {
            return {
                opcode: toRaw(proxiedBlock.opcode),
                parts: toRaw(proxiedBlock.parts),
                useDecorator: toRaw(proxiedBlock.useDecorator),
                text: proxiedBlock.text,
                plainText: proxiedBlock.plainText
            };
        },
        currentBlock() {
            return this.toRawBlockData({
                opcode: this.blockOpcode,
                parts: this.parts,
                useDecorator: this.useDecorator,
                text: this.calcBlockText(this.parts),
                plainText: this.calcBlockTextWithoutArgInfo(this.parts)
            });
        },
        findBlock(opcode) {
            return this.blocks.find(block => block.opcode === opcode) || null;
        },
        removePart(index) {
            this.parts = this.parts.filter((_, i) => String(i) !== String(index));
        },
        buildServerHost() {
            let url = window.location;
            return url.protocol + "//" + url.hostname + ":" + 1145 + "/api"
        },
        async generatedCode() {
            const response = await fetch(
                this.buildServerHost(),
                {
                    method: "post",
                    body: JSON.stringify({
                        blocks: this.blocks
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            const generated = await response.text();
            navigator.clipboard.writeText(generated);
            alert("已复制")
        },
        generatedRandomNodeName() {
            let result = "node" + Math.floor(Math.random() * 1000000);
            while (this.findNode(result)) { result = "node" + Math.floor(Math.random() * 1000000); };
            return result;
        },
        addNormalNode() {
            this.nodes.push({
                isEntry: false,
                name: this.generatedRandomNodeName(),
                next: null,
                position: new Vector(100, 100)
            });
        },
        addEntryNode() {
            this.nodes.push({
                isEntry: true,
                name: this.generatedRandomNodeName(),
                next: null,
                position: new Vector(100, 100)
            });
        }
    }
}
</script>