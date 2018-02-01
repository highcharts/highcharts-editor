/******************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

******************************************************************************/

// @format

// Alias to drawer editor
highed.Editor = highed.DrawerEditor;

(function() {
  var instanceCount = 0,
    installedPlugins = {},
    activePlugins = {},
    pluginEvents = highed.events(),
    stepPlugins = {};

  ///////////////////////////////////////////////////////////////////////////

  /** Install an editor plugin
      *
      *  Note that plugins must be enabled when creating the editor
      *  for it to be active.
      *
      *  @namespace highed.plugins.editor
      *
      *  @param name       {string} - the name of the plugin
      *  @param definition {object} - the plugin definition
      *     > meta {object}
      *         > version {string}
      *         > author {string}
      *         > homepage {string}
      *     > dependencies {array<string>} - URLs of script dependencies
      *     > options {object}
      *         > option_name {object}
      *             > type {string} - the type of the option
      *             > label {string} - the label
      *             > default {anything} - the default value
      */
  function install(name, definition) {
    var properties = highed.merge(
      {
        meta: {
          version: 'unknown',
          author: 'unknown',
          homepage: 'unknown'
        },
        dependencies: [],
        options: {}
      },
      definition
    );

    console.error('Warning: editor plugins are no longer supported.');

    properties.dependencies.forEach(highed.include);

    if (!highed.isNull(installedPlugins[name])) {
      return highed.log(1, 'plugin -', name, 'is already installed');
    }

    installedPlugins[name] = properties;
  }

  function use(name, options) {
    var plugin = installedPlugins[name],
      filteredOptions = {};

    console.error('Warning: editor plugins are no longer supported.');

    if (!highed.isNull(plugin)) {
      if (activePlugins[name]) {
        return highed.log(2, 'plugin -', name, 'is already active');
      }

      //Verify options
      Object.keys(plugin.options).forEach(function(key) {
        var option = plugin.options[key];
        if (highed.isBasic(option) || highed.isArr(option)) {
          highed.log(
            2,
            'plugin -',
            name,
            'unexpected type definition for option',
            key,
            'expected object'
          );
        } else {
          filteredOptions[key] =
            options[key] || plugin.options[key].default || '';

          if (option.required && highed.isNull(options[key])) {
            highed.log(1, 'plugin -', name, 'option', key, 'is required');
          }
        }
      });

      activePlugins[name] = {
        definition: plugin,
        options: filteredOptions
      };
      filteredOptions;

      if (highed.isFn(plugin.activate)) {
        activePlugins[name].definition.activate(filteredOptions);
      }

      pluginEvents.emit('Use', activePlugins[name]);
    } else {
      highed.log(2, 'plugin -', name, 'is not installed');
    }
  }

  //Public interface
  highed.plugins.editor = {
    install: install,
    use: use
  };

  //UI plugin interface
  highed.plugins.step = {
    install: function(def) {
      stepPlugins[def.title] = def;
    }
  };
})();
