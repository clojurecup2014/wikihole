(ns wikihole.graphics
  (:use [c2.core :only [unify]]
        [clojure.string :as string :only [join]]
        [hiccup.core]
        [analemma.charts]
        [analemma.svg]
        [analemma.xml])
  (:require [c2.scale :as scale]
            [clojure.data.json :as json]))

(import '[java.util Date]
        '[java.text SimpleDateFormat])

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

(defn pretty-date
  [millis]
  (let [date-style (new SimpleDateFormat "EEEE, MMMM dd, yyyy, h:mm a")
        my-date (new Date (* 1000 millis))]
    (.format date-style my-date)))

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
             [:p (pretty-date (get visit :time_visited))]]
            )]))])))

(defn trip-graphs
  [trip-json-string]
  (let [trip (get (json/read-str trip-json-string) "visits")]
  (reduce
   str
   (for [visit trip]
     (html
      [:h2 (parse-title-from-url (get visit "url"))]
      [:p (pretty-date (get visit "time_visited"))])))))

(defn
  time-with-per-page
  [trip-json-str]
  (let
    [trip (get (json/read-str trip-json-str) "visits")
     names (map (fn [visit] (parse-title-from-url (get visit "url"))) (butlast trip))
     times (map (fn [visit] (get visit "time_visited")) trip)
     time-per-page (butlast
                    (map-indexed (fn
                                   [idx itm]
                                   (- (nth times (+ idx 1) itm) itm))
                                 times))]
    (vec (map vector (butlast times) time-per-page))))

(html (emit-svg
         (-> (xy-plot :xmin -30 :maxx 10,
                      :ymin -30 :maxy 30
                      :height 300 :width 1000)
             (add-points [[-2 3] [0 5]]))))

(def analemma-data
     [[-15.165	-23.07]
      [-17.016	-22.70]
      [-19.171	-22.08]
      [-21.099	-21.27]
      [-22.755	-20.30]
      [-24.107	-19.16]
      [-25.446	-17.33]
      [-25.914	-16.17]
      [-26.198	-14.62]
      [-26.158	-12.96]
      [-25.814	-11.21]
      [-25.194	-9.39]
      [-24.520	-7.89]
      [-23.708	-6.37]
      [-22.529	-4.42]
      [-21.205	-2.45]
      [-19.777	-0.48]
      [-18.289	1.50]
      [-16.185	4.24]
      [-15.009	5.78]
      [-13.605	7.66]
      [-12.309	9.49]
      [-11.153	11.26]
      [-10.169	12.94]
      [-9.250	14.85]
      [-8.811	16.04]
      [-8.469	17.43]
      [-8.364	18.69]
      [-8.493	19.83]
      [-8.847	20.82]
      [-9.685	21.96]
      [-10.317	22.47]
      [-11.231	22.96]
      [-12.243	23.28]
      [-13.308	23.43]
      [-14.378	23.41]
      [-15.599	23.16]
      [-16.339	22.86]
      [-17.139	22.33]
      [-17.767	21.64]
      [-18.191	20.80]
      [-18.387	19.81]
      [-18.253	18.20]
      [-17.956	17.17]
      [-17.361	15.78]
      [-16.529	14.28]
      [-15.474	12.68]
      [-14.221	11.01]
      [-12.183	8.54]
      [-10.901	7.07]
      [-9.212	5.20]
      [-7.462	3.29]
      [-5.693	1.36]
      [-3.946	-0.59]
      [-1.938	-2.93]
      [-0.686	-4.48]
      [0.742	-6.39]
      [1.982	-8.28]
      [2.993	-10.11]
      [3.742	-11.88]
      [4.290	-14.23]
      [4.318	-15.49]
      [4.044	-16.97]
      [3.420	-18.33]
      [2.446	-19.55]
      [1.135	-20.63]
      [-0.852	-21.71]
      [-2.398	-22.29]
      [-4.538	-22.86]
      [-6.855	-23.24]
      [-9.286	-23.42]
      [-11.761	-23.41]
      [-14.691	-23.14]])

;;;;;;;;;;;;;; TODO Delete below

(defn test-chart
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
(defn test-chart-two
  []
  (html (emit-svg
         (-> (xy-plot :xmin -30 :maxx 10,
                      :ymin -30 :maxy 30
                      :height 300 :width 1000)
             (add-points analemma-data)))))



