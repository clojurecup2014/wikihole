(ns wikihole.customcss
  (:require [garden.core :refer [css]]
            [garden.def :refer [defstylesheet defstyles]]
            [garden.units :refer [px]]))

;;;;;;; Garden documentation: https://github.com/noprompt/garden
;;;;;;; Foundation documentation: http://foundation.zurb.com/docs/

(def body-font "Roboto")
(def body-font-weight "300")
(def bold-font-weight "500")
(def header-font "Roboto Slab")
(def header-font-weight "700")
(def body-font-size "18px")

(def colors {:body-background "white"
             :body-font "#222"
             :masthead-bg "#333"
             :masthead-color "white"})

(defn google-font-tag
  "Makes the link tag that imports Google fonts"
  []
  (str ;;;;;;;; header font ;;;;;;;
       "<link href='http://fonts.googleapis.com/css?family="
       (clojure.string/replace header-font " " "+") ":" header-font-weight
       "|"
       ;;;;;;;; body font ;;;;;;;;;
       (clojure.string/replace body-font " " "+") ":"
       (clojure.string/join "," [body-font-weight body-font-weight "italic"
                                 bold-font-weight bold-font-weight "italic"])
       "' rel='stylesheet' type='text/css'>"))

(defstyles screen
  [:body {:color (get colors :body-font)
          :background-color (get colors :body-background)}]
  [:body :p :li :label :.button :input
   {:font-family body-font
    :font-weight body-font-weight
    :font-size body-font-size}]
  [:strong {:font-weight bold-font-weight}]
  [:h1 :h2 :h3 :h4 :h5 :h6
   {:font-family header-font
    :font-weight header-font-weight}]
  [:#masthead
   {:background-color (get colors :masthead-bg)
    :margin "0px"
    :padding "40px 0"}
   [:h1 :h2 :h3 :h4 :h5 :h6 {:color (get colors :masthead-color)}]])

