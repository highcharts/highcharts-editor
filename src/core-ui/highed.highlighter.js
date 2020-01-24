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

/** Highlighter - Used for highlighting columns in the data table
 *  @constructor
 */
highed.Highlighter = function() {
    events = highed.events();
    
  ////////////////////////////////////////////////////////////////////////////

  function colorHeader(gcolumns, values, color) {
    var tempValue = values[0];
    if (values.length > 0) {
      while (tempValue <= values[values.length - 1]) {
        if (gcolumns[tempValue]) {
          highed.dom.style(gcolumns[tempValue].letter, {
            "background-color": color.light,
            "border-left": "1px double " + color.dark,
            "border-top": "1px double " + color.dark,
            "border-bottom": "1px double " + color.dark,
            "border-right": "1px double " + color.dark,
          });        
          highed.dom.style(gcolumns[tempValue].header, {
            "background-color": color.light,
            "border-left": "1px double " + color.dark,
            "border-right": "1px double " + color.dark,
            "border-bottom": "1px double " + color.dark,
          });
        }
        tempValue++;
      }
    }
  }

  function colorCells(rows, values, color) {
    if (values.length > 0) {
      rows.forEach(function(row) {
        var tempValue = values[0];
        while (tempValue <= values[values.length - 1]) {
          if (row.columns[tempValue]) {
            highed.dom.style(row.columns[tempValue].element, {
              "background-color": color.light 
            });      
          }  
          tempValue++;
        }
      });
    }
  }

  function outlineCell(rows, values, color) {
    values.forEach(function(value, index) {
      rows.forEach(function(row) {
        if (row.columns[value]) {
          highed.dom.style(row.columns[value].element, {
            "border-right": (index === (values.length - 1) ? '1px double ' + color.dark : ''),
            "border-left": (index === 0 ? '1px double ' + color.dark : ''),
          });
        }
      });
    });
  }

  function decolorCells(rows, previousValues) {
    if (previousValues && previousValues.length > 0) {
      
      rows.forEach(function(row) {
        var tempValue = previousValues[0];
        if (previousValues.length > 0) {
          while (tempValue <= previousValues[previousValues.length - 1]) {
            if (row.columns[tempValue]) {
              highed.dom.style(row.columns[tempValue].element, {
                "background-color": ''
              });
            }
            tempValue++; //= getNextLetter(tempValue);
          }
        }
      });
    }
  }

  function decolorHeader(gcolumns, previousValues) {
    if (previousValues && previousValues.length > 0){
      var tempValue = previousValues[0];
      if (previousValues.length > 0) {
        while (tempValue <= previousValues[previousValues.length - 1]) {
          if (gcolumns[tempValue]) {
            highed.dom.style([gcolumns[tempValue].letter, gcolumns[tempValue].header], {
              "background-color": '',
              "border": '',
            });
          }
          tempValue++; //= getNextLetter(tempValue);
        }
      }
    }
  }

  function removeOutlineFromCell(rows, values) {
    (values || []).forEach(function(value) {
      (rows || []).forEach(function(row){
        if (row.columns[value]) { //May have been deleted on startup
          highed.dom.style(row.columns[value].element, {
            "border-right": '',
            "border-left": '',
          });
        }
      });
    });
  }

  function removeCellColoring(rows, gcolumns, previousValues) {
    removeOutlineFromCell(rows, previousValues);
    decolorHeader(gcolumns, previousValues);
    decolorCells(rows, previousValues);
  }

  function colorFields(rows, gcolumns, values, color) {
    outlineCell(rows, values, color);
    colorCells(rows, values, color);
    colorHeader(gcolumns, values, color);
  }

  function highlightCells(rows, gcolumns, previousValues, values, input, newOptions) {
    removeCellColoring(rows, gcolumns, previousValues);
    colorFields(rows, gcolumns, values, input.colors);
    //events.emit('AssignDataChanged', input, newOptions);
  }

  function removeAllCellsHighlight(rows, gcolumns, previousValues, values, input, newOptions) {
    removeCellColoring(rows, gcolumns, values);
  }

  ////////////////////////////////////////////////////////////////////////////

  return {
    on: events.on,
    //highlightSelectedFields: highlightSelectedFields,
    highlightCells: highlightCells,
    removeAllCellsHighlight: removeAllCellsHighlight,
  };
};
