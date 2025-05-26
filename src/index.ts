import { Compilation, Compiler } from 'webpack'

const PLUGIN_NAME = "PluginPatchPlugin"

type PatchOptionsResult = Record<string, any> | any[]
type PatchOptionsFunction = () => PatchOptionsResult

/**
 * This plugin allows you to patch the options of a Webpack plugin after the environment has been set up.
 */
export class PluginPatchPlugin {

  private pluginIdentifier: Function | string
  private patchOptions: {}
  private hookName: keyof Compiler['hooks']

  /**
   * @param {Function|string} pluginIdentifier Either the plugin’s constructor (class) or its class name as a string.
   * @param {Function|object|[]} patchOption The options you want to override/merge into the original options, can be either an object or an array of arguments.or a function that returns an object or an array of arguments.
   * @param {string} [hookName='environment'] The name of the compiler hook to tap into (e.g., 'environment', 'afterEnvironment').
   * 
   * @see {@link https://webpack.js.org/api/compiler-hooks/} for a list of available hooks.
   */
  constructor(pluginIdentifier: Function | string, patchOptions: PatchOptionsResult | PatchOptionsFunction, hookName?: keyof Compiler['hooks']) {
    if (!pluginIdentifier) {
      throw new Error(`${PLUGIN_NAME}: missing pluginIdentifier.`)
    }
    if (!pluginIdentifier || typeof pluginIdentifier !== 'function' && typeof pluginIdentifier !== 'string') { 
      throw new Error(`§{PLUGIN_NAME}: typeof pluginIdentifier was ${typeof pluginIdentifier} but must be a function (plugin's constructor) or a string (plugin's class name).`)
    }
    this.pluginIdentifier = pluginIdentifier
    this.patchOptions = patchOptions || {}
    this.hookName = hookName ?? 'environment'
  }

  /**
   * Apply function is automatically called by the Webpack main compiler
   * @param compiler The Webpack compiler variable
   */
  apply(compiler) {
    const hook = compiler.hooks[this.hookName]
    if (!hook || typeof hook.tap !== 'function') {
      throw new Error(`${PLUGIN_NAME}: Hook '${this.hookName}' is not available. See https://webpack.js.org/api/compiler-hooks/ for a list of available hooks.`)
    }
    hook.tap(PLUGIN_NAME, (compilation) => {
      compilation.getLogger(PLUGIN_NAME).info(`Patching options for plugin: ${typeof this.pluginIdentifier === 'string' ? this.pluginIdentifier : this.pluginIdentifier.name}`)
      compiler.options.plugins = compiler.options.plugins.map(plugin => {
        if (typeof this.pluginIdentifier === 'string' ? plugin.constructor.name === this.pluginIdentifier : plugin instanceof this.pluginIdentifier) {
          const patchOptions: PatchOptionsResult = typeof this.patchOptions === 'function'
            ? (this.patchOptions)()
            : this.patchOptions
          return new plugin.constructor(...(Array.isArray(patchOptions) ? patchOptions : [{ ...((plugin as any).options || {}), ...patchOptions }]))
        } else {
          return plugin
        }
      })
    })
  }
}
