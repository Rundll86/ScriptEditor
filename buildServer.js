const fs = require("fs");
const express = require("express");
const cors = require("cors");
const app = express();
function template() {
    return fs.readFileSync("./templates/extension.js", { encoding: "utf-8" }).toString();
};
app.use(cors());
app.use(express.json());
app.post("/api", (req, res) => {
    const tmplate = template();
    /**
     * @type {any[]}
     */
    const blocks = req.body.blocks;
    let result = tmplate;
    result = result.replaceAll("$blocks$", JSON.stringify(blocks.map(e => {
        const arguments = {};
        e.parts.forEach(part => {
            if (!part.isText) {
                arguments[part.content] = {
                    type: part.data.inputType.toLowerCase(),
                    defaultValue: part.data.defaultValue
                };
            };
        });
        return {
            type: "command",
            opcode: e.opcode,
            text: e.plainText,
            arguments
        };
    }), null, 4).replaceAll("\n", "\n" + " ".repeat(4).repeat(4)));
    result = result.replaceAll("$methods$", blocks.map(e => {
        return `${e.opcode}(){};`
    }).join("\n" + " ".repeat(4).repeat(2)));
    res.send(result);
});
app.listen(1145, "0.0.0.0", () => {
    console.log("Build server is running on port 1145");
});