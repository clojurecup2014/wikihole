(ns wikihole.pluginwriter
  (:require [clojure.data.json :as json]
            [garden.core :refer [css]]
            [garden.def :refer [defstylesheet defstyles]]
            [garden.units :refer [px]])
  (:use [hiccup.core]
        [hiccup.page]))

(def plugin-style
  (css [:body {:font-family "Helvetica"
               :color "purple"}]))

(def body-font "Arial")
(def header-font "Courier")
(def body-font-size "18px")
(def min-width "500px")

(def colors {:body-background "white"
             :body-font "#222"
             :button-bg "#78389e"
             :button-bg-hover "#602d7e"
             :button-font "white"})

(defstyles screen ;;; lein garden auto compiles this
  [:.text-center {:text-align "center"}]
  [:body {:color (get colors :body-font)
          :background-color (get colors :body-background)
          :width min-width}]
  [:body :p :li :label :.button :input
   {:font-family body-font
    :font-size body-font-size}]
  [:h1 :h2 :h3 :h4 :h5 :h6
   {:font-family header-font
    :font-size "24px"}]
  [:button.button
   {:padding "10px 20px"
    :background-color (get colors :button-bg)
    :color (get colors :button-font)
    :outline "none"
    :border-width "0px"
    :cursor "pointer"}
   [:&:hover {:background-color (get colors :button-bg-hover)}]])

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
     (include-js "popup.js")
     (include-css "main.css")]
    [:body.text-center
     [:h1.text-center "Hello, world! This is the Wikihole Chrome extension, v. 0.0."]
     [:p.text-center "Document your Wikitrip:"]
     [:button#send-data.button "Go!"]])))

(defn write-plugin
  []
  (spit "resources/public/plugin/manifest.json" (manifest-str))
  (spit "resources/public/plugin/popup.html" (html-str)))

(write-plugin)
