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

## Installing and Building

**Pre-built**

You can find pre-built stable releases [here](https://github.com/highcharts/highcharts-editor/releases).

**Package Managers**

The editor is pushed to NPM and Bower under `highcharts-editor`.

**Cloning and building the repository**

	git clone https://github.com/highcharts/highcharts-editor
	cd highcharts-editor
	npm install
	grunt

This will put a built version in the `dist` folder.

## Embedding Hello World

	<!DOCTYPE html>
	<html>
		<head>

		</head>
		<body>
			<div id="highcharts-editor"></div>
		</body>
		<script>
			//Create an editor widget and attach it to the highcharts-editor div
			var editor = highed.Editor('highcharts-editor');
		</script>
	</html>

## API Quick Reference

**Full documentation can be found [here](#).**

### highed.Editor

The `highed.Editor` object is the full chart editor, containing by default a wizard-style interface for chart creation.

**Constructor**

`highed.Editor(parent, properties)` creates a new chart editor instance, and attaches it to the supplied parent node. The `parent` argument can either be a string containing the ID of a DOM node, or a DOM node instance.

Properties is an object as such:
		
	{
        //Events to listen for - same as calling Editor.on(...)
        on: {
            'EventName': <function>
        }
	}

**Interface**

  * `Editor.on(<event>, <callback>)`: Listen for an event emitted by the editor. See list of events below.
  * `Editor.resize()`: Force a resize of the editor widget.
  * `Editor.getEmbeddableHTML()`: Get a string containing HTML to replicate the current chart.
  * `Editor.getEmbeddableJSON()`: Get a json string containing the current charts properties that can be used to initialize a duplicate chart.

**Editor Events**

  * `Resized`: Emitted when the editor is resized
  * `ChartChange`: Emitted when the chart being edited changes. Passed argument is the current chart settings. 

## Customizing the exposed settings

Sometimes, only a sub-set of editable settings is required. 

To that end, the `update.meta` tool in the `tools/` folder can be used to create a custom build of the editor which only includes the desired settings.

**Usage**
        
        node tools/update.meta.js --exposed <JSON file with an array of options to include>

After running the tool, run `grunt` in the project root to bake your custom build.
Take a look at [dictionaries/exposed.settings.json](dictionaries/exposed.settings.json) to see how to format the input JSON file. 

## License

[MIT](LICENSE).