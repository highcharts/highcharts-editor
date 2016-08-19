Highcharts Editor
===

*Stand-alone and embeddable chart editor for Highcharts*

## Introduction

highcharts-editor is a lightweight chart editor for highcharts that can be embedded into existing frameworks and libraries, or used stand-alone.
It requires no back-end services to operate.

## Features

## Building

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

## API Reference

### highed.Editor

The `highed.Editor` object is the full chart editor, containing a wizard-style interface for chart creation.

`highed.Editor(parent)` creates a new chart editor instance, and attaches it to the supplied parent node. The parent can either be a string containing the ID of a dom node, or a dom node instance.

  * `Editor.on(<event>, <callback>)`: Listen for an event emitted by the editor. See list of events below.
  * `Editor.resize()`: Force a resize of the editor widget.

** Editor Events **

  * `Resized`: Emitted when the editor is resized
  * `ChartChange`: Emitted when the chart being edited changes. Argument is the chart settings. 

## License

[MIT](LICENSE).