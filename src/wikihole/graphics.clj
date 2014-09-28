(ns wikihole.graphics
  (:use [c2.core :only [unify]]
        [clojure.string :as string :only [join]]
        [hiccup.core])
  (:require [c2.scale :as scale]
            [clojure.data.json :as json]))

;;;;;;;;;; C2 documentation: https://github.com/lynaghk/c2

(defn css-str
  "Turns a map of attributes+values, i.e. {:height 20 :width 30}, into a CSS string for inline styling"
  ;; Meant for inline-styling/data-driven-styling only
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

(defn string-keys-to-symbols [map]
  (reduce #(assoc %1 (-> (key %2) keyword) (val %2)) {} map))

(defn parse-title-from-url
  [url]
  (let [prefix #"http://en.wikipedia.org/wiki/"]
    (clojure.string/replace
     (clojure.string/replace
      (clojure.string/replace
       url prefix "") ;; remove URL parts
      "_" " ") ;; replace underscores
     #"#.*" ""))) ;; remove # endings

(defn user-graphs
  [user-trips-json-string]
  (let [data (vec (map string-keys-to-symbols (json/read-str user-trips-json-string)))
        all-trips (vec (map string-keys-to-symbols (get (first data) :trips)))
        trips (vec (remove (fn [itm] (= 0 (count (get itm :visits)))) all-trips))]
    (html
     [:div#container
      (reduce
       str
       (for [trip trips]
         [:div#trip
          [:h1 "Trip " (get trip :trip_id)]
          (for [visit (vec (map string-keys-to-symbols (get trip :visits)))]
            [:div#trip
             [:h1 (parse-title-from-url (get visit :url))]
             [:p "Visited At: " (get visit :time_visited)]]
            )]))])))


