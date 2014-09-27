(ns wikihole.plugin-js)

(enable-console-print!)

(defn init []
  (println "Hello, world! We have mastered Clojurescript :D"))

(set! (.-onload js/window) init)
