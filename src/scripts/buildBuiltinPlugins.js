const { buildSync } = require('esbuild')
const path = require('path')
const fs = require('fs').promises
const versions = require('../preval/versions')

const plugins = ['@tailwindcss/aspect-ratio', '@tailwindcss/custom-forms', '@tailwindcss/ui']

plugins.forEach(async (plugin) => {
  const pkg = require(`${plugin}/package.json`)

  const output = buildSync({
    entryPoints: [
      path.resolve(__dirname, `../../node_modules/${plugin}`, pkg.main),
    ],
    write: false,
    minify: true,
    bundle: true,
    external: ['fs', 'path', 'util'],
    format: 'esm',
  })

  await fs.mkdir(
    path.resolve(__dirname, '../../public/plugins', versions.pluginBuilder),
    {
      recursive: true,
    }
  )

  if (plugin.includes('/')) {
    const parts = plugin.split('/')
    await fs.mkdir(
      path.resolve(
        __dirname,
        '../../public/plugins',
        versions.pluginBuilder,
        ...parts.slice(0, parts.length - 1)
      ),
      {
        recursive: true,
      }
    )
  }

  const code = new TextDecoder('utf-8').decode(output.outputFiles[0].contents)

  await fs.writeFile(
    path.resolve(
      __dirname,
      '../../public/plugins',
      versions.pluginBuilder,
      `${plugin}@${pkg.version}.js`
    ),
    'var require = () => ({ deprecate: _ => _ });' + code,
    'utf8'
  )
})
