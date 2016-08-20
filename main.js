var fs = require("fs");

var stylesPath = 'index.html',
    sax = require("sax"),
    parser = sax.parser(false),
    htmlContent = '',
    map = {};

function readStyles() {
    return fs.readFile(stylesPath, function(error, data) {
        if(error) {
            console.error(error);
        }
        htmlContent = data.toString();
        ExtractStyleFromHTML(htmlContent);
    });
}

function updateHtml(styleToWrite) {
    return fs.writeFile(stylesPath, styleToWrite, function(err) {
        if(err) {
            console.error(err);
        }
        console.log('write is done!')
    });
}

function convertToClass(className, style) {
    var style = 'style="' + style + '"';
    var classToReplace = 'class="' + className + '"';
    console.log(style, classToReplace)
    htmlContent.replace(style, classToReplace);
}

function ExtractStyleFromHTML(html) {
    var count = 0;
    parser.onopentag = function(node) {
        if(node.attributes && node.attributes.STYLE) {
            var className = 's'+count,
                style = node.attributes.STYLE;
            //put in the map
            map[className] = node.attributes.STYLE;
            //replace in html
            convertToClass(className, style);
            count++;
        }
    }
    parser.write(html);
    console.log('**Mapp', map)
     //console.log(htmlContent)
    //updateHtml(htmlContent);
}

readStyles();


