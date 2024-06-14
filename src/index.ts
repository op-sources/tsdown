import process from 'node:process'
import { type InputOptions, rolldown } from 'rolldown'
import {
  type Options,
  type OptionsWithoutConfig,
  normalizeOptions,
} from './options'
import { logger, removeFiles } from './utils'

export async function build(userOptions: Options = {}): Promise<void> {
  const { entry, external, plugins, outDir, format, clean } =
    await normalizeOptions(userOptions)

  if (clean) {
    await removeFiles(['**/*', ...clean], outDir)
    logger.info('Cleaning output folder')
  }

  const inputOptions: InputOptions = {
    input: entry,
    external,
    plugins,
    resolve: {
      alias: userOptions.alias,
    },
  }
  const build = await rolldown(inputOptions)

  await Promise.all(
    format.map((format) =>
      build.write({
        format,
        dir: outDir,
      }),
    ),
  )
  await build.destroy()

  logger.info('Build complete')
  process.exit(0)
}

export function defineConfig(
  options: OptionsWithoutConfig,
): OptionsWithoutConfig {
  return options
}
