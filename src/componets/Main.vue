<template>
    <div class="content">
        <LeftBox :blocks="blocks" :states="windowState" />
        <RightBox :blocks="blocks" />
    </div>
    <div class="high-layer">
        <SubWindow title="Block Settings" :states="windowState" name="block">
            <div class="args">
                <span class="tip" v-if="parts.length === 0">
                    There're not any parts.
                </span>
                <ArgumentPart @remove="removePart" :index="index" :part="part" v-for="part, index in parts"
                    :isText="part.isText" :content="part.content" />
            </div>
            <div class="config-bar">
                Use decorator?
                <CheckBox v-model="useDecorator" class="left-auto" />
            </div>
            <div class="config-bar">
                Add parts
                <WideButton class="left-auto" @click="addText">Text</WideButton>
                <WideButton @click="addArg">Arg</WideButton>
            </div>
            <div class="config-bar">
                Block opcode:
                <input style="margin-left: 10px;" v-model="blockOpcode" :disabled="disabledOpcode">
                <WideButton @click="autoOpcode">Auto</WideButton>
            </div>
            <div class="config-bar">
                <WideButton class="left-auto" @click="saveBlock">Save</WideButton>
            </div>
        </SubWindow>
        <SubWindow title="Loaders" :states="windowState" name="loaders">
            testtesttest<br>
            placeholder
        </SubWindow>
        <SubWindow title="Project" :states="windowState" name="project">
            <div class="projs">
                <WideButton @click="generatedCode">Generate</WideButton>
                <WideButton>Export</WideButton>
                <WideButton>Test in TurboWarp</WideButton>
                <WideButton>Test in GandiIDE</WideButton>
            </div>
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
    left: 30px;
    top: 50px;
    width: calc(100vw - 30px);
    height: calc(100vh - 50px);
}

.left-auto {
    margin-left: auto !important;
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

.config-bar {
    display: flex;
    align-items: center;
    margin: 5px 0;
    text-wrap: nowrap;
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
</style>
<script setup>
import LeftBox from './LeftBox.vue';
import RightBox from './RightBox.vue';
import SubWindow from './SubWindow.vue';
import ArgumentPart from './ArgumentPart.vue';
import CheckBox from './CheckBox.vue';
import WideButton from './WideButton.vue';
import { toRaw } from 'vue';
import md5 from 'md5';
</script>
<script>
export default {
    data() {
        return {
            blocks: [],
            windowState: {
                block: false,
                menus: false,
                loaders: false,
                project: false
            },
            parts: [
                {
                    content: 'Alert',
                    isText: true
                },
                {
                    content: 'something',
                    isText: false,
                    data: {
                        inputType: "String",
                        defaultValue: "",
                        loader: null,
                        menu: null
                    }
                },
                {
                    content: 'to window',
                    isText: true
                }
            ],
            blockOpcode: "",
            disabledOpcode: false,
            useDecorator: false
        };
    },
    methods: {
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
        }
    }
}
</script>