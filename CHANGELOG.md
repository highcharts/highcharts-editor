# 0.2.0-beta-preview
  * Added `complete` target to build script which bakes in all modules and advanced mode into one source file
  * Re-implemented advanced view: now has a smaller footprint, and bugs regarding arrays are fixed
  * Grid data importer is now the default (can be disabled by overriding `features` when instancing the editor)
  * Streamlined the build system: generated sources now ends up in `generated_src` instead of in the main source tree
  * Converted the advanced meta generator to use the new meta format
  * Converted templates to use config objects instead of dash paths, and extended its meta data
  * Templates now have sample data sets associated with them
  * Module system for product bundles: Highstock support now lives in its own module so that it's easier to include just what's needed. This is the first step in enabling maps support.
  * WordPress plugin now has a settings page (Under "Settings" in the WP admin panel) where advanced mode, and Highstock support can be toggled
  * New design
  * Google Spreadsheets now integrated out-of-the-box
  * Template thumbnails are now part of the editor rather than linking to cloud.highcharts.com
  * Misc bug fixes and enhancements
  * Custom wizard steps can now be added using the `highed.plugins.step` interface
  * Added sticky chart properties. See [wiki](https://github.com/highcharts/highcharts-editor/wiki/Sticky-Chart-Options).
  * Added `highed.options` to set multiple options in one call.
  * Added `defaultLanguage` to global options
  * Added `includeCDNInExport` to global options, which when false will not include CDN references in HTML exports

## NOTES

  The template manager now follow the same pattern as the other managers (e.g. `highed.templates.add`).

  *There's also changes to the way Highstock/Highcharts is loaded*
  If you need support for Highstock, Highcharts, and/or Highmaps, this now has to be explicitly included using the modules `highcharts-editor.module.highstock|highcharts.js`.
  Alternatively, build with the `complete` target which bundles all available modules as well as advanced mode into one source script.
  
# 0.1.3-beta, January 24th 2017
  * Fixed an issue with font sizes in font widget
  * Fixed an issue with embedding charts in Wordpress
  * Fixed an issues with global options (i.e. localization/language options)
  * Fixed an issue with `undefined` when using bower
  * Fixed an issue with localization options in exported (html) charts

# 0.1.2-beta, January 3rd 2017

  * Fixed general IE issues
  * Fixed IE issues for exported charts
  * Fixed issue with save/load project
  * Fixed scrolling in SimpleEditor
  * Improved the API for the doneEditing callback in modal editor
  * Expanded localization system [see wiki](https://github.com/highcharts/highcharts-editor/wiki/Localization)
  * Updated inline API documentation
  * Simple editor features can now be toggled
  * General stability enhancements and bug fixes
  * Added CHANGELOG.md to keep track of changes
