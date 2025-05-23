# PluginPatchPlugin

The `PluginPatchPlugin` plugin allows you to patch the options of a Webpack plugin after the environment has been set up.

## Arguments

| Name             | Type              | Explanation |
| ---------------- | ----------------- | -------------------- | 
| pluginIdentifier | {Function|string} | pluginIdentifier Either the plugin’s constructor (class) or its constructor name as a string. |
| patchOption      | {object}          |  The new  options you want to override/merge into the original options. |

## patchOptions

Review the documentation of the plugin that you want to patch. You can provide all or any subset of the options of the target plugin. The provided options will be merged with the options of the exisitng plugin before replacing the plugin with a new instance of the plugin and the new options.

## Example

``` javascript
module.exports = {
  plugins: [
    new webpack_1.optimize.LimitChunkCountPlugin({
        maxChunks: 1
    }),
    new PluginPatchPlugin(optimize.LimitChunkCountPlugin, {
        maxChunks: 1000
    })
  ]
}
```

During runtime, early in the the PluginPatchPlugin replaces the LimitChunkCountPlugin with a new instance of the plugin with option maxChunk = 1000.
The PluginPatchPlugin remains in the array of plugins but will not do anything else further in the process.


``` javascript
module.exports = {
  plugins: [
    new webpack_1.optimize.LimitChunkCountPlugin({
        maxChunks: 1000 // changed
    }),
    new PluginPatchPlugin(optimize.LimitChunkCountPlugin, {
        maxChunks: 1000
    })
  ]
}
````
