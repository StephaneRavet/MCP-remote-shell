"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const server = new mcp_js_1.McpServer({
    name: "remote-shell",
    version: "1.0.0"
});
server.tool("execute", {
    targetServer: zod_1.z.string(),
    username: zod_1.z.string(),
    command: zod_1.z.string()
}, async ({ targetServer, username, command }) => {
    try {
        const { stdout, stderr } = await execAsync(`ssh ${username}@${targetServer} "${command}"`);
        return {
            content: [{
                    type: "text",
                    text: stdout || stderr
                }]
        };
    }
    catch (error) {
        const err = error;
        return {
            content: [{
                    type: "text",
                    text: `Erreur: ${err.message}`
                }],
            isError: true
        };
    }
});
const transport = new stdio_js_1.StdioServerTransport();
server.connect(transport);
