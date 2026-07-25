import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const isWindows = process.platform === "win32";

const commands = [
  {
    name: "web",
    command: isWindows ? "npx.cmd vite --host 127.0.0.1 --port 5174" : "npx vite --host 127.0.0.1 --port 5174",
    cwd: join(rootDir, "apps", "web")
  },
  {
    name: "api",
    command: "python run.py",
    cwd: join(rootDir, "apps", "api")
  },
  {
    name: "ai",
    command: isWindows ? "npx.cmd tsx watch src/server.ts" : "npx tsx watch src/server.ts",
    cwd: join(rootDir, "apps", "ai-worker")
  }
];

const children = commands.map(({ name, command, cwd }) => {
  console.log(`[${name}] starting: ${command}`);
  const child = spawn(command, {
    cwd,
    stdio: "inherit",
    shell: true
  });

  child.on("error", (error) => {
    console.error(`[${name}] failed to start: ${error.message}`);
  });

  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
    }
  });

  return child;
});

function shutdown() {
  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
