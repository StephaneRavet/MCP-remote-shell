import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const server = new McpServer({
  name: "remote-shell",
  version: "1.0.0",
  description: "Un serveur MCP qui permet d'exécuter des commandes SSH sur des serveurs distants. Utile pour l'automatisation et la gestion à distance de serveurs. Peut être utilisé avec des alias de serveurs pour simplifier les commandes."
});

server.tool(
  "execute",
  {
    targetServer: z.string().describe("L'adresse du serveur distant (ex: example.com ou IP). Non requis si aliasServer est fourni."),
    aliasServer: z.string().describe("L'alias du serveur distant (ex: 'mon VPS', 'prod-server'). Si fourni, l'IA utilisera cet alias au lieu de targetServer.").optional(),
    username: z.string().describe("Le nom d'utilisateur pour la connexion SSH"),
    command: z.string().describe("La commande à exécuter sur le serveur distant")
  },
  async ({ targetServer, aliasServer, username, command }: { targetServer: string; aliasServer?: string; username: string; command: string }) => {
    try {
      const server = targetServer;
      const { stdout, stderr } = await execAsync(`ssh ${username}@${server} "${command}"`);
      return {
        content: [{
          type: "text",
          text: stdout || stderr
        }]
      };
    } catch (error: unknown) {
      const err = error as Error;
      return {
        content: [{
          type: "text",
          text: `Erreur: ${err.message}`
        }],
        isError: true
      };
    }
  }
);

const transport = new StdioServerTransport();
server.connect(transport);
