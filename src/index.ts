import webpack, { Compiler, WebpackPluginInstance } from 'webpack'

/**
 * This plugin allows you to patch the options of a Webpack plugin after the environment has been set up.
 */
export class PluginPatchPlugin {

  private pluginIdentifier: Function | string
  private patchOptions: {}
  private hookName: keyof Compiler['hooks']

  /**
   * @param {Function|string} pluginIdentifier Either the plugin’s constructor (class) or its constructor name as a string.
   * @param {object} patchOption The fields you want to override/merge into the original options.
   * @param {string} [hookName='environment'] The name of the compiler hook to tap into (e.g., 'environment', 'afterEnvironment').
   * 
   * @see {@link https://webpack.js.org/api/compiler-hooks/} for a list of available hooks.
   */
  constructor(pluginIdentifier: Function | string, patchOptions, hookName: keyof Compiler['hooks']) {
    this.pluginIdentifier = pluginIdentifier
    this.patchOptions = patchOptions
    this.hookName = hookName
  }

  /**
   * Apply function is automatically called by the Webpack main compiler
   * @param compiler The Webpack compiler variable
   */
  apply(compiler) {
    const hook = compiler.hooks[this.hookName]
    if (!hook || typeof hook.tap !== 'function') {
      throw new Error(`PluginPatchPlugin: Hook '${this.hookName}' is not available. See https://webpack.js.org/api/compiler-hooks/ for a list of available hooks.`)
    }
    hook.tap('PatchPluginOptions', () => {
      compiler.options.plugins = compiler.options.plugins.map(plugin => {
        if (typeof this.pluginIdentifier === 'string' ? plugin.constructor.name === this.pluginIdentifier : plugin instanceof this.pluginIdentifier) {
          return new plugin.constructor({ ...(plugin.options || {}), ...this.patchOptions })
        } else {
          return plugin
        }
      })
    })
  }
}
