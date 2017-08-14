import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-minify'

export default {
  entry: 'src/index.js',
  format: 'umd',
  moduleName: 'keypound',
  dest: 'dist/keypound.js',
  plugins: [
    babel({
      plugins: ['external-helpers'],
      exclude: 'node_modules/**' // only transpile our source code
    }),
    minify({ 
      umd: {
        dest: 'dist/keypound.min.js',
        sourceMapUrl: 'dist/keypound.min.js.map'
      }
    })
  ]
};