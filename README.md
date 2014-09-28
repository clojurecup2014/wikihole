# Down the Wikihole

Super cool stuff!

## TODOs
- Get link outputted in plugin
- Package up plugin somehow - enable user to download
- Prettify
- Add 404 page

## Running

To start a web server for the application, run:

    lein ring server

## Clojurescript

To compile .cljs files to Javascript, run:

    lein cljsbuild auto

See: [https://github.com/emezeske/lein-cljsbuild](https://github.com/emezeske/lein-cljsbuild)

## CSS

To compile .css files, run:

    lein garden auto

See: [https://github.com/noprompt/lein-garden](https://github.com/noprompt/lein-garden)

## Plugin

The code to write the plugin is in /src/wikihole/pluginwriter.clj.
I've been building it in the REPL with the line:

    (write-plugin)
