# SVG map parser for Highcharts Maps

This tool creates Highcharts Maps out of SVG files. The result is an array of paths
that can be fed to the Highcharts Maps `mapData` option.

## Usage
Run the map parser from [GitHub Pages](http://highcharts.github.io/maps-from-svg).

## Debugging
On Mac - from the root directory, `python -m SimpleHTTPServer 8000` then open the
website in `http://localhost:8000`.

## Publishing
Debug and work on the master. Merge into `gh-pages` and push.

## About the tool
* SVG maps can be found online. For a starting point, try Googling for "Blank SVG maps".
* Not all maps are successfully parsed using this tool. If you are having problems try opening the file in Inkscape, the free SVG editor, and simplify the shapes. Inkscape also has a "Save optimized" option that reduces file size. If that doesn't help, [post an issue](https://github.com/highcharts/maps-from-svg/issues), and we might be able to improve the parser. Or even better, go directly for the pull request.
* To add names to geographic areas, the easiest way is to open the SVG in Inkscape and apply a label to each shape.