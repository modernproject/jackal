const fs = require('fs')
const execSync = require('child_process').execSync
const prettyBytes = require('pretty-bytes')
const gzipSize = require('gzip-size')

const exec = (command, extraEnv) =>
  execSync(command, {
    stdio: 'inherit',
    env: Object.assign({}, process.env, extraEnv)
  })

console.log('Building CommonJS ...')

exec('babel src -d build --ignore __tests__', {
  BABEL_ENV: 'cjs'
})

console.log('\nBuilding ES ...')

exec('babel src -d es --ignore __tests__', {
  BABEL_ENV: 'es'
})

console.log('\nBuilding index.js ...')

exec('rollup -c -f umd -o umd/index.js', {
  BABEL_ENV: 'umd',
  NODE_ENV: 'development'
})

console.log('\nBuilding index.min.js ...')

exec('rollup -c -f umd -o umd/index.min.js', {
  BABEL_ENV: 'umd',
  NODE_ENV: 'production'
})

const size = gzipSize.sync(
  fs.readFileSync('umd/index.min.js')
)

console.log('\ngzipped, the UMD build is %s', prettyBytes(size))