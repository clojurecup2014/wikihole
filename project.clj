(defproject wikihole "0.1.0-SNAPSHOT"
  :description "Charts users' adventures down the Wikihole"
  :url "http://example.com/FIXME"
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [compojure "1.1.8"]
                 [hiccup "1.0.5"]
                 [garden "1.2.1"]
                 [com.keminglabs/c2 "0.2.3"]
                 [org.clojure/clojurescript "0.0-2356"]
                 [robert/hooke "1.3.0"]
                 [ring/ring-json "0.3.1"]
                 [korma "0.3.0"]
                 [org.postgresql/postgresql "9.3-1100-jdbc41"]
                 [org.clojars.pallix/analemma "1.0.0" :exclusions [org.clojure/clojure]]]
  :plugins [[lein-ring "0.8.11"]
            [lein-cljsbuild "1.0.3"]
            [lein-garden "0.2.1"]]
  :ring {:handler wikihole.handler/app}
  :cljsbuild {:builds [{ ;; For the plugin
                        :source-paths ["src/wikihole/plugin"]
                        :compiler {:output-to "resources/public/plugin/popup.js"}}
                       { ;; For the web app
                        :source-paths ["src/wikihole/graphics"]
                        :compiler {:output-to "resources/public/javascripts/main.js"}}]}
  :garden {:builds [{;; For the website
                     :source-paths ["src"]
                     ;; The var containing your stylesheet:
                     :stylesheet wikihole.customcss/screen
                     ;; Compiler flags passed to `garden.core/css`:
                     :compiler {;; Where to save the file:
                                :output-to "resources/public/stylesheets/main.css"
                                ;; Compress the output?
                                :pretty-print? false}}
                    {;; For the plugin
                     :source-paths ["src"]
                     ;; The var containing your stylesheet:
                     :stylesheet wikihole.pluginwriter/screen
                     ;; Compiler flags passed to `garden.core/css`:
                     :compiler {;; Where to save the file:
                                :output-to "resources/public/plugin/main.css"
                                ;; Compress the output?
                                :pretty-print? false}}]}
  :profiles
  {:dev {:dependencies [[javax.servlet/servlet-api "2.5"]
                        [ring-mock "0.1.5"]]}}
  :auto-clean false
  ;;;;; Uncomment below if we want to automatically compile CSS + JS we run lein tasks
  ;;;;; :hooks [leiningen.garden leiningen.cljsbuild]
  )
