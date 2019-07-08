# 0.2.2-rc3
  * Added data import failure detection for when it's not possible to deduce the CSV delimiter
  * Added special case for handling the dataLabels type
  * Added support for the `series-label` module
  * Added `encodedUrl` to custom code
  * Added function to clear the theme
  * Added support for live data
  * Fixed an issue with deleting rows not updating the chart
  * Fixed default values for adding new rows
  * Fixed an issue with custom code and series
  * Google Spreadsheet support now extracts the correct ID from a URL
  * Navigation events in the editor now emits `UIAction` events on the global even object
  * Misc smaller performance and bug fixes

# 0.2.1-rc2
  * Fixed issue causing propagation of importer properties to fail
  * Fixed issue with hiding the advanced/custom code/preview tabs in customizer
  * Fixed issue with HTML entities in CSV columns
  * Fixed issue causing custom code to revert to default value when containing invalid code
  * Fixed issue with script loading
  * Fixed issue with `assignTheme` and null values
  * Fixed issue with setting global options to `0`/`false`/etc.
  * Chart title (if set) is now used when saving projects
  * Added auto code formatting on commit
  * Load project now emits the proper `LoadProject` event when there's data in the project
  * Now loading series properly when using Google Spreadsheets
  * Rows can now be added before/after the selected row in the data grid
  * Added controls to preview the chart with different sizes
  * Improved error feedback on misconfigurations
  * Customizer `availableSettings` option now support dot-separated options (e.g. `series.title`)
  * Added `autoIncludeDependencies` option
  * Updated Advanced Meta to use Highcharts 6.0.7
  * Misc minor bug fixes and enhancements

# 0.2.0-rc1
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
  * New modal-based help system
  * Highcharts Cloud integrations - save/load charts to/from the cloud
  * Google Spreadsheets now integrated out-of-the-box
  * Template thumbnails are now part of the editor rather than linking to cloud.highcharts.com
  * Misc bug fixes and enhancements
  * Editor plugins are now deprecated: use `editor.on('ChartChangedLately'..)` instead.
  * Custom wizard steps can now be added using the `highed.plugins.step` interface
  * Added sticky chart properties. See [wiki](https://github.com/highcharts/highcharts-editor/wiki/Sticky-Chart-Options).
  * Added `highed.options` to set multiple options in one call.
  * Added `defaultLanguage` to global options
  * Added `includeCDNInExport` to global options, which when false will not include CDN references in HTML exports
  * Added `thumbnailURL` to global options, which allows for specifying where to fetch the template thumbnails from

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
