# Highcharts Editor Roadmap

## 0.0.1-beta: Release first week of September, 2016

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
    * Data import: CSV + JSON 
    * Chart export: HTML + JSON
    * Templates: basic library of templates
    * Customize: most common types editable (primitives + styling + arrays)
        * Same basic set of modifiable properties as on Highcharts Cloud
    * Embed: get HTML + JSON output
    * Array types in the property customizer
    * Advanced options in the property customizer
    * Basic responsiveness
    * Simple plugin API

**Ecosystem/Tooling**
    
    * Gulp build script to bake sources
    * Electron build option
    * Custom property sub-set baking
    * Integration demos
        * TinyMCE
