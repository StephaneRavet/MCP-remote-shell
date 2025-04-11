import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['dist/index.js']
  });

  const client = new Client({
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