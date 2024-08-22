import { globSync } from "glob";
import * as esbuild from "esbuild";
import * as tsup from "tsup";
import { cpus } from "os";
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Building packages...");

const build = async (path) => {
  const file = `${path}/src/index.ts`;
  const dist = `${path}/dist`;

  const esbuildConfig = {
    entryPoints: [file],
    external: ["@squared-ui/*"],
    packages: "external",
    bundle: true,
    sourcemap: true,
    target: "es2022",
    outdir: dist,
  };

  await esbuild.build(esbuildConfig);
  console.log(`Built ${path}/dist/index.js`);

  await esbuild.build({
    ...esbuildConfig,
    format: "esm",
    outExtension: { ".js": ".mjs" },
  });
  console.log(`Built ${path}/dist/index.mjs`);

  await tsup.build({
    entry: [file],
    format: ["cjs", "esm"],
    dts: { only: true },
    outDir: dist,
    silent: true,
    external: [/@squared-ui\/.+/],
  });
  console.log(`Built ${path}/dist/index.d.ts`);
};

if (isMainThread) {
  const paths = globSync("src/*/*");
  const numCores = cpus().length;
  const numWorkers = Math.min(numCores, paths.length);

  let currentIndex = 0;

  const workerPromises = Array.from(
    { length: numWorkers },
    () =>
      new Promise((resolve, reject) => {
        const worker = new Worker(__filename, {
          workerData: paths[currentIndex++],
        });

        worker.on("message", () => {
          if (currentIndex < paths.length) {
            worker.postMessage(paths[currentIndex++]);
          } else {
            worker.terminate().then(resolve);
          }
        });

        worker.on("error", reject);
        worker.on("exit", (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      }),
  );

  Promise.all(workerPromises).then(() => {
    console.log("All packages built.");
  });
} else {
  build(workerData).then(() => {
    parentPort.postMessage("done");
  });
}
