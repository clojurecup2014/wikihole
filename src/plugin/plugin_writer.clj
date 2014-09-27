(ns wikihole.plugin-writer
  (:require [clojure.data.json :as json]
            [garden.core :refer [css]]
            [garden.def :refer [defstylesheet defstyles]]
            [garden.units :refer [px]])
  (:use [hiccup.core]
        [hiccup.page]))

(defn manifest-str
  []
  (json/write-str
   {"manifest_version" 2,
    "name" "Wikihole",
    "version" "0.0",
    "description" "Chart your journey down the Wikihole!",
    "browser_action" {
                      ;; "default_icon" "icon.png",
                      "default_popup" "popup.html"
                      "default_icon" "icon.png"
                      },
    "web_accessible_resources" [
                                "popup.js"],

    "permissions" [
                   "history"
                   ]}))


(defn html-str
  []
  (html5
   (html
    [:head
     [:title "Down the Wikihole!"]
     (include-js "popup.js")]
    [:body
     [:h1 "Hello, world! This is the Wikihole Chrome extension. v. 0.0."]])))

(defn write-plugin
  []
  (spit "resources/public/plugin/manifest.json" (manifest-str))
  (spit "resources/public/plugin/popup.html" (html-str)))

(write-plugin)
