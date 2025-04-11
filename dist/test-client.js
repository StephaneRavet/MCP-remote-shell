"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
async function main() {
    const transport = new stdio_js_1.StdioClientTransport({
        command: 'node',
        args: ['dist/index.js']
    });
    const client = new index_js_1.Client({
        name: 'test-client',
        version: '1.0.0'
    });
    await client.connect(transport);
    // Test de l'outil execute
    const result = await client.callTool({
        name: 'execute',
        arguments: {
            targetServer: 'example.com',
            username: 'testuser',
            command: 'ls -la'
        }
    });
    console.log('Résultat:', result);
}
main().catch(console.error);
