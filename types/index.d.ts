import { Compiler } from 'webpack';
/**
 * This plugin allows you to patch the options of a Webpack plugin after the environment has been set up.
 */
export declare class PluginPatchPlugin {
    private pluginIdentifier;
    private patchOptions;
    private hookName;
    /**
     * @param {Function|string} pluginIdentifier Either the plugin’s constructor (class) or its constructor name as a string.
     * @param {object} patchOption The fields you want to override/merge into the original options.
     * @param {string} [hookName='environment'] The name of the compiler hook to tap into (e.g., 'environment', 'afterEnvironment').
     *
     * @see {@link https://webpack.js.org/api/compiler-hooks/} for a list of available hooks.
     */
    constructor(pluginIdentifier: Function | string, patchOptions: any, hookName: keyof Compiler['hooks']);
    /**
     * Apply function is automatically called by the Webpack main compiler
     * @param compiler The Webpack compiler variable
     */
    apply(compiler: any): void;
}
