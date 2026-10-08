import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import nextEnv from '@next/env';

export function requiresContentApproval(env) {
  return (env.VERCEL_ENV || env.DEPLOYMENT_ENV) === 'production' && env.CONTENT_APPROVED !== 'true';
}
export async function contentTodos(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const lists = await Promise.all(
    entries.map(async (entry) => {
      const filename = path.join(root, entry.name);
      if (entry.isDirectory()) return contentTodos(filename);
      if (!/\.(ts|tsx)$/.test(entry.name)) return [];
      return (await readFile(filename, 'utf8'))
        .split(/\r?\n/)
        .flatMap((line, i) =>
          line.includes('TODO(content)') ? [`${filename}:${i + 1}: ${line.trim()}`] : [],
        );
    }),
  );
  return lists.flat();
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  nextEnv.loadEnvConfig(process.cwd());
  if (requiresContentApproval(process.env)) {
    const todos = await contentTodos(path.resolve('src'));
    console.error(
      'Production content approval is required. Review CONTENT_TODO.md and resolve or approve every remaining TODO(content) item, then set CONTENT_APPROVED=true.\n' +
        todos.join('\n'),
    );
    process.exitCode = 1;
  }
}
