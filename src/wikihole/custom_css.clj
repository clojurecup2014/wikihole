(ns wikihole.custom-css
  (:require [garden.core :refer [css]]))

;;;;;;; Garden documentation: https://github.com/noprompt/garden
;;;;;;; Foundation documentation: http://foundation.zurb.com/docs/

(def body-font "Roboto")
(def body-font-weight "300")
(def bold-font-weight "500")
(def header-font "Roboto Slab")
(def header-font-weight "700")
(def body-font-size "18px")

(def colors {:body-background "white"
             :body-font "#222"})

(defn google-font
  "Makes the import-Google-fonts String for a header and body font"
  []
  (str "@import url(http://fonts.googleapis.com/css?family="
       ;;;;;;;; header font ;;;;;;;
       (clojure.string/replace header-font " " "+") ":" header-font-weight
       "|"
       ;;;;;;;; body font ;;;;;;;;;
       (clojure.string/replace body-font " " "+") ":"
       (clojure.string/join "," [body-font-weight body-font-weight "italic"
                                 bold-font-weight bold-font-weight "italic"]) ");"))

(defn make-stylesheet
  "Site-wide custom styles"
  []
  (str "<style type=\"text/css\">"
       (google-font)
       (css [:body {:color (get colors :body-font)
                    :background-color (get colors :body-background)}]
            [:body :p :li :label :.button :input
                 {:font-family body-font
                  :font-weight body-font-weight
                  :font-size body-font-size}]
            [:strong {:font-weight bold-font-weight}]
            [:h1 :h2 :h3 :h4 :h5 :h6
                 {:font-family header-font
                  :font-weight header-font-weight}])
       "</style>"))
