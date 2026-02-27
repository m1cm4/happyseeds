#!/usr/bin/env node
import { execSync } from "node:child_process";

const bump = process.argv[2];
if (!bump || !["patch", "minor", "major"].includes(bump)) {
   console.error("Usage: pnpm release <patch|minor|major>");
   process.exit(1);
}

const sh = (cmd) => execSync(cmd, { stdio: "inherit" });
const clean = execSync("git status --porcelain").toString().trim();
if (clean) {
   console.error("Working tree dirty. Commit/stash first.");
   process.exit(1);
}

sh(`pnpm -r version ${bump} --no-git-tag-version`);
sh("pnpm install --frozen-lockfile");

const version = execSync("node -p \"require('./package.json').version\"").toString().trim();

sh("git add .");
sh(`git commit -m "🔖 chore: release v${version}"`);
sh(`git tag v${version}`);