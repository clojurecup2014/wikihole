(ns wikihole.pluginjs)

(enable-console-print!)

(defn init []
  (println "Hello, world! We have mastered Clojurescript :D"))

(set! (.-onload js/window) init)
