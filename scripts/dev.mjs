import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const adminDir = path.join(rootDir, "admin");
const isWindows = process.platform === "win32";

let adminProcess = null;

function runNpm(args, cwd) {
  if (isWindows) {
    return spawn("cmd.exe", ["/d", "/s", "/c", `npm.cmd ${args.join(" ")}`], {
      cwd,
      stdio: "inherit",
      shell: false,
    });
  }

  return spawn("npm", args, {
    cwd,
    stdio: "inherit",
    shell: false,
  });
}

function isPortOpen(port, host = "127.0.0.1") {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host });

    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });

    socket.once("error", () => {
      resolve(false);
    });
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureAdminServer() {
  if (await isPortOpen(4300)) {
    console.log("Admin API already running on http://127.0.0.1:4300");
    return;
  }

  console.log("Starting admin API on http://127.0.0.1:4300");
  adminProcess = runNpm(["start"], adminDir);

  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (await isPortOpen(4300)) {
      return;
    }

    if (adminProcess.exitCode !== null) {
      throw new Error("Admin API exited before port 4300 became available.");
    }

    await wait(500);
  }

  throw new Error("Admin API did not start on port 4300.");
}

function cleanup() {
  if (adminProcess && adminProcess.exitCode === null) {
    adminProcess.kill();
  }
}

process.on("SIGINT", () => {
  cleanup();
  process.exit(130);
});

process.on("SIGTERM", () => {
  cleanup();
  process.exit(143);
});

try {
  await ensureAdminServer();
} catch (error) {
  console.error(error.message);
  cleanup();
  process.exit(1);
}

const viteProcess = runNpm(["run", "dev:vite"], rootDir);

viteProcess.on("error", (error) => {
  console.error(error.message);
  cleanup();
  process.exit(1);
});

viteProcess.on("exit", (code) => {
  cleanup();
  process.exit(code ?? 0);
});
