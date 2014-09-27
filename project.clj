(defproject wikihole "0.1.0-SNAPSHOT"
  :description "Charts users' adventures down the Wikihole"
  :url "http://example.com/FIXME"
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [compojure "1.1.8"]
                 [hiccup "1.0.5"]
                 [garden "1.2.1"]
                 [com.keminglabs/c2 "0.2.3"]
                 [org.clojure/clojurescript "0.0-2356"]]
  :plugins [[lein-ring "0.8.11"]
            [lein-cljsbuild "1.0.3"]]
  :ring {:handler wikihole.handler/app}
  :cljsbuild {
              :builds [{
                        ;;; For the web app
                        :source-paths ["src/web-js"]
                        :compiler {
                                   :output-to "resources/public/javascripts/main.js"  ; default: target/cljsbuild-main.js
                                   :optimizations :whitespace
                                   :pretty-print true}}
                       {
                        ;; For the plugin
                        :source-paths ["src/plugin"]
                        :compiler {:output-to "resources/public/javascripts/plugin.js"}}]}
  :profiles
  {:dev {:dependencies [[javax.servlet/servlet-api "2.5"]
                        [ring-mock "0.1.5"]]}})
