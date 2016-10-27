
# Highcharts Editor Roadmap

## 0.1.0-beta: Release late-October, 2016

**Editor Features**

  * Modularized editor
    * Full (wizard-like)
    * Properties only
        * Default options set at "compile" time
    * Data import only
        * Default options set at "compile" time
    * Simple
        * One-page editor
        * Basic property subset (no left-side categories)
        * Basic template picker
        * Modal data import (?)            
  * Data import: CSV + JSON + Samples 
  * Chart export: HTML + JSON + SVG
  * Templates: basic library of templates
  * Customizer
    * Supported types in the UI:
      * string
      * number
      * range
      * boolean
      * color
      * cssobject
      * object
      * options (drop down)
      * font
      * array of any of the supported types
    * Optional whitelisting of options to include
    * Simple Editor: Same basic set of modifiable properties as on Highcharts Cloud
    * Advanced Editor: (optional) in the property customizer
  * Data import plugins
  * Data export plugins
  * Editor plugins
  * Basic phone/tablet support

**Ecosystem/Tooling**
    
  * Gulp build script to bake sources
  * Electron build option
  * Custom property sub-set baking
  * Plugin samples
    * Import:
      * csv
      * Difi
      * gspreadsheets
      * Socrata
    * Export
      * Beautified JS
      * Beautified JSON
    * Editor
      * REST auto poster
  * Integration demos
    * TinyMCE
    * Wordpress
    * CKEditor

## 0.2.0: Initial non-beta release, date TBA

*Main focus will be bug fixes and general improvements*

**Editor Features**

  * Sample data for each template