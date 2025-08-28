import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

export default [
  // CommonJS build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'auto'
    },
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs()
    ],
    external: ['https', 'url']
  },
  // ES Module build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.esm.js',
      format: 'es'
    },
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs()
    ],
    external: ['https', 'url']
  },
  // UMD build (for Node.js environments only)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'WxWork'
    },
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      terser()
    ],
    external: ['https', 'url']
  }
];