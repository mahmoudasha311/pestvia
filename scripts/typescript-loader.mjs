import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));

export async function resolve(specifier, context, nextResolve) {
  if (
    specifier.startsWith('@/') ||
    ((specifier.startsWith('.') || specifier.startsWith('file:')) &&
      context.parentURL?.endsWith('.ts'))
  ) {
    const candidate = specifier.startsWith('@/')
      ? path.join(root, 'src', specifier.slice(2))
      : fileURLToPath(new URL(specifier, context.parentURL));
    for (const filename of [
      candidate,
      `${candidate}.ts`,
      `${candidate}.tsx`,
      path.join(candidate, 'index.ts'),
    ]) {
      try {
        if ((await stat(filename)).isFile())
          return { url: pathToFileURL(filename).href, shortCircuit: true };
      } catch {
        /* Try the next supported module path. */
      }
    }
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (/\.tsx?$/.test(url)) {
    const source = await readFile(fileURLToPath(url), 'utf8');
    return {
      format: 'module',
      shortCircuit: true,
      source: ts.transpileModule(source, {
        fileName: fileURLToPath(url),
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
          jsx: ts.JsxEmit.ReactJSX,
        },
      }).outputText,
    };
  }
  return nextLoad(url, context);
}
