import eslint from '@rollup/plugin-eslint'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import postcss from 'rollup-plugin-postcss'
import { terser } from "rollup-plugin-terser"
// import pkg from './package.json'

const plugins = [
  eslint({
    fix: true,
    throwOnError: true,
    throwOnWarning: true,
    include: ['src/**'],
    exclude: ['node_modules/**', './src/scss/**', './src/css/**']
  }),
  postcss({
    plugins: []
  }),
  replace({
    preventAssignment: true,
    delimiters: ['{{', '}}'],
    DEVELOPMENT: process.env.NODE_ENV
    // VERSION: pkg.version
  }),
  nodeResolve({
    preferBuiltins: false
  }),
  babel({
    babelHelpers: 'runtime',
    exclude: [
      /\/core-js\//
    ]
  }),
  //terser(),
]

export default [
  {
    input: 'index.js',
    output: {
      file: 'dist/mac-input.js',
      format: 'umd',
      name: 'MacInput',
      inlineDynamicImports: true
    },
    plugins: plugins
  }
]