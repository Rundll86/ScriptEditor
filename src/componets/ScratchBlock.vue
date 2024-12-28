<template>
    <div>
        <span class="block" :style="{
            backgroundColor: color,
            borderColor: darken(color, 0.4),
        }">
            <span>
                <span v-for="part in parsed" :key="part.content">
                    <span v-if="part.type === 'text'" class="text">{{ part.content }}</span>
                    <span v-if="part.type === 'input'">
                        <input :value="part.value" :type="part.inputType === 'number' ? 'number' : 'text'"
                            class="inputer" @input="autoWidthInput">
                    </span>
                </span>
            </span>
        </span>
    </div>
</template>
<script>
import { watch } from 'vue';
class ArgumentPart {
    content = "";
    type = "text";
    value = "";
    inputType = "string";
    constructor(content, type, value = "", inputType = "string") {
        this.content = content;
        this.type = type;
        if (value !== undefined) this.value = value;
        if (inputType !== undefined) this.inputType = inputType;
    }
}
const TextParser = {
    inputTypeCastConstructor: {
        string: String,
        number: Number,
        bool: Boolean,
        menu: String,
        angle: Number,
        color: String,
        "hat-paramater": String,
    },
    acceptedInputType: ["string", "number", "bool", "menu", "angle", "color", "hat-paramater"],
    regex: /(\[.*?\])|(\$.*?;)/g,
    split(target) {
        const arg = target.match(this.regex) || [];
        const text = target.split(this.regex);
        return {
            text: text.filter(item => item !== undefined).filter((_, index) => index % 2 === 0),
            arg: arg.filter(Boolean).map(item => item.slice(1, -1))
        };
    },
    parsePart(text) {
        const result = [];
        const parts = this.split(text);
        parts.text.forEach((item, index) => {
            if (!item) { return; };
            result.push(new ArgumentPart(item, "text"));
            if (parts.arg.length > index) {
                result.push(new ArgumentPart(
                    this.parseName(parts.arg[index]),
                    "input",
                    this.parseDefaultValue(parts.arg[index]),
                    this.parseType(parts.arg[index])
                ));
            };
        });
        return result;
    },
    hasType(arg) {
        return arg.includes(":");
    },
    hasDefaultValue(arg) {
        return arg.includes("=");
    },
    parseType(arg) {
        if (!this.hasType(arg)) {
            return "string";
        };
        const splited = arg.split(":");
        splited.shift();
        let result = splited.join(":");
        if (this.hasDefaultValue(arg)) {
            result = result.split("=", 1)[0];
        };
        if (!this.acceptedInputType.includes(result)) {
            throw new Error(`Invalid input type: ${result}`);
        };
        return result;
    },
    parseDefaultValue(arg) {
        if (!this.hasDefaultValue(arg)) {
            return;
        };
        const result = arg.split("=").pop();
        return this.inputTypeCastConstructor[this.parseType(arg)](result);
    },
    parseName(arg) {
        return arg.split(/[:=]/)[0];
    }
};
export default {
    name: 'ScratchBlock',
    mounted() {
        this.reloadParts();
        watch(
            () => this.$slots.default()[0].children,
            () => this.reloadParts()
        );
    },
    data() {
        return {
            /**
             * @type {ArgumentPart[]}
             */
            parsed: []
        }
    },
    props: {
        color: {
            type: String,
            default: "#ff0000"
        }
    },
    methods: {
        darken(color, level) {
            const rgb = this.hexToRgb(color);
            for (let i = 0; i < 3; i++) {
                rgb[i] = Math.floor(rgb[i] - (rgb[i] * level))
            };
            return `#${rgb.map((i) => i.toString(16).padStart(2, "0")).join('')}`;
        },
        hexToRgb(str) {
            let hexs = [];
            const reg = /^#?[0-9A-Fa-f]{6}$/;
            if (!reg.test(str)) throw new Error('Invalid hex color string');
            str = str.replace('#', '');
            hexs = str.match(/../g) || [];
            if (hexs.length < 3) throw new Error('Invalid hex color string');
            return [parseInt(hexs[0], 16), parseInt(hexs[1], 16), parseInt(hexs[2], 16)];
        },
        reloadParts() {
            this.parsed = TextParser.parsePart(this.$slots.default()[0].children);
        }
    }
}
</script>
<style scoped>
* {
    padding: 0;
    margin: 0;
    border: none;
    outline: none
}

.block {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: 2px solid;
    padding: 5px;
    border-radius: 5px;
}

.block * {
    color: white;
}

.inputer,
.text {
    margin: 0 2px;
}

.inputer {
    border-radius: 5px;
    padding: 5px;
    color: black;
    background-color: white;
}

.tip {
    margin: 5px;
    display: inline-block;
}
</style>