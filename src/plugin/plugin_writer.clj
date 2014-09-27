(ns wikihole.plugin-writer
  (:require [clojure.data.json :as json]
            [garden.core :refer [css]]
            [garden.def :refer [defstylesheet defstyles]]
            [garden.units :refer [px]])
  (:use [hiccup.core]
        [hiccup.page]))


(defn write-manifest
  []
  (spit "resources/public/plugin/manifest.json"
        (json/write-str {"name" "Wikihole",
                         "version" "0.0",
                         "manifest_version" 2,
                         "description" "Chart your journey down the Wikihole!",
                         "browser_action" {
                                           ;; "default_icon" "icon.png",
                                           "popup" "index.html"
                                           }})))

(defn write-html
  []
  (spit "resources/public/plugin/index.html"
        (html5
         (html
          [:body
           [:h1 "Hello, world! This is our Chrome extension. v. 0.0."]]))))

(defn write-plugin
  []
  (write-manifest)
  (write-html))

(write-plugin)
