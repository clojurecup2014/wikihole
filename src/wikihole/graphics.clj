(ns wikihole.graphics
  (:use [c2.core :only [unify]]
        [clojure.string :as string :only [join]]
        [hiccup.core])
  (:require [c2.scale :as scale]))

(defn css-str
  "Turns a map of attributes+values, i.e. {:height 20 :width 30}, into a CSS-formatted string"
  [user-attrs]
  (let [attrs (merge {:num-format "px"} user-attrs)]
    (string/join ";"
                 (into []
                       (for [property (keys attrs)
                             :when (not= :num-format property)]
                         (str (name property) ":"
                              (if (number? (property attrs))
                                (str (property attrs) (:num-format attrs))
                                (property attrs))))))))

(defn test
  "To be deleted. Visible for now at /test-chart."
  []
  (html (let [width 300, bar-height 30
              data {"A" 1, "B" 2, "C" 4, "D" 3}
              s (scale/linear :domain [0 (apply max (vals data))]
                              :range [0 width])]

          [:div#bars
           (unify data (fn [[label val]]
                         [:div {:style (css-str {:height bar-height
                                                 :width (s val)
                                                 :background-color "gray"})}
                          [:span {:style (css-str {:color "white"})} label]]))])))
