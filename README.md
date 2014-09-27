# Down the Wikihole

Super cool stuff!

## TODOs
- Set up deployment
- Web app structure
- Plugin
- Prettify

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

The code to write the plugin is in /plugin/plugin_writer.clj.
I've been building it in the REPL with the line:

    (write-plugin)
