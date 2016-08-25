var fs = require('fs'),
    sax = require('sax');

var srcFile = 'index.html',
    destFile = 'main.html',
    cssFile = 'styles.css',
    parser =  sax.parser(false),
    map = {},
    readableStream = fs.createReadStream(srcFile),
    writableStream = fs.createWriteStream(destFile),
    writableStream2 = fs.createWriteStream(cssFile);

readableStream.setEncoding('utf8');
readableStream.on('data', function(chunk) {
    writableStream.write(parseChunk(chunk));
});

function parseChunk(content) {
    var count = 0;
    parser.onopentag = function(node) {
        if(node.attributes && node.attributes.STYLE) {
            var className = 's'+count,
                style = node.attributes.STYLE;
            //put in the map
            map[className] = node.attributes.STYLE;
            //replace in html
            var htmlStyle = 'style="' + style + '"';
            var classToReplace = 'class="' + className + '"';
            content = content.replace(htmlStyle, classToReplace);

            //add to styles
            var styleClass = '.' + className + '{ ' + style +' }';
            writableStream2.write(styleClass)
            count++;
        }
    }
    parser.write(content);
    return content;
}



