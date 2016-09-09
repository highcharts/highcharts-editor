Highcharts Editor
===

*Stand-alone and embeddable chart editor for Highcharts*

![screenshots/customize.png](screenshots/customize.png)

## Introduction

`highcharts-editor` is a lightweight chart editor for highcharts that can be embedded into existing frameworks and libraries, or used stand-alone.
It requires no back-end service to operate.

## Features
	
  * No dependencies except from Highcharts
  * Lightweight: weighs in at less than 100kb
  * 100% client-side
  * Outputs both HTML and JSON
  * Optional wizard-style interface
  * Highly configurable
  * Plugin system

## Installing and Building

**Pre-built**

You can find pre-built stable releases [here](https://github.com/highcharts/highcharts-editor/releases).

**Package Managers**

The editor is pushed to NPM and Bower under `highcharts-editor`.

**Cloning and building the repository**

	git clone https://github.com/highcharts/highcharts-editor
	cd highcharts-editor
	npm install
	gulp

*Notice for windows users:** You need [7zip]() installed and added to your path for `gulp electron` to work!

This will put a built version in the `dist` folder.

## Embedding Hello World

	<!DOCTYPE html>
	<html>
		<head>
      <link href='https://fonts.googleapis.com/css?family=Roboto:400,300,100,700|Source Sans:400,300,100' rel='stylesheet' type='text/css'/>
      <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>

      <link href="./highcharts-editor.min.css" type="text/css" rel="stylesheet"/>
      <script src="./highcharts-editor.min.js" type="text/javascript" charset="utf-8"></script>
		</head>
		<body>
			<div id="highcharts-editor"></div>
		</body>
		<script>
			//Create an editor widget and attach it to the highcharts-editor div
			var editor = highed.Editor('highcharts-editor');
		</script>
	</html>

## Integrations

  * [TinyMCE](https://github.com/highcharts/highcharts-editor/wiki/TinyMCE)
  * [Wiki](https://github.com/highcharts/highcharts-editor/wiki/Wordpress)
  * [Electron](https://github.com/highcharts/highcharts-editor/wiki/Native_OSX_Windows_Linux)

## API Reference

See [wiki](https://github.com/highcharts/highcharts-editor/wiki/API).

## Customizing the exposed settings

Sometimes, only a sub-set of editable settings is required. 

To that end, the `update.meta` tool in the `tools/` folder can be used to create a custom build of the editor which only includes the desired settings.

**Usage**
        
        node tools/update.meta.js --exposed <JSON file with an array of options to include>

After running the tool, run `gulp` in the project root to bake your custom build.
Take a look at [dictionaries/exposed.settings.json](dictionaries/exposed.settings.json) to see how to format the input JSON file. 

## Enabling the Advanced Property Editor

The advanced editor allows for editing every property in the Highcharts API. When enabled, it appears in a separate tab --- ADVANCED --- in the customize wizard step.

By default, only the simple property editor is included in baked sources. This is because the required meta data to enable the advanced editor is large enough to be inconvenient in most cases (adds around 400kb to the minified sources).

To enable the advanced editor:
    
    node tools/updatebake.advanced.js

This will create the required meta in the source tree. Run `gulp with-advanced` afterwards to bake sources with the advanced editor enabled.

## Plugins

The editor supports data handling plugins. Plugins are registered using the `highed.plugins.install` function. They must also be activated, either by calling `highed.plugins.use(<plugin name>, <plugin options>)`, or by supplying the name of the plugin in the editor constructor (see editor section above).

See [plugins/jquery-simple-rest.js](plugins/jquery-simple-rest.js) for an example on how to write plugins.

## License

[MIT](LICENSE).