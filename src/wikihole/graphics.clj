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

(def trip-json-string "{\"visits\":[{\"time_visited\":1411337214,\"url\":\"http://en.wikipedia.org/wiki/Mole_rat\"},{\"time_visited\":1411339555,\"url\":\"http://en.wikipedia.org/wiki/INI_file\"},{\"time_visited\":1411344171,\"url\":\"http://en.wikipedia.org/wiki/Rae_Sremmurd\"},{\"time_visited\":1411345695,\"url\":\"http://en.wikipedia.org/wiki/P-Poppin\"},{\"time_visited\":1411347150,\"url\":\"http://en.wikipedia.org/wiki/Emotion_(Samantha_Sang_song)\"},{\"time_visited\":1411348269,\"url\":\"http://en.wikipedia.org/wiki/Wikipedia:Wiki_Game\"},{\"time_visited\":1411350072,\"url\":\"http://en.wikipedia.org/wiki/Jeremih_discography\"},{\"time_visited\":1411350144,\"url\":\"http://en.wikipedia.org/wiki/List_of_Billboard_Hot_100_top_10_singles_in_2009\"},{\"time_visited\":1411350460,\"url\":\"http://en.wikipedia.org/wiki/The_Weeknd_discography\"},{\"time_visited\":1411350727,\"url\":\"http://en.wikipedia.org/wiki/Imma_Star_(Everywhere_We_Are)\"},{\"time_visited\":1411355712,\"url\":\"http://en.wikipedia.org/wiki/Little_Big_Man_(film)\"},{\"time_visited\":1411361088,\"url\":\"http://en.wikipedia.org/wiki/Unforgiven\"},{\"time_visited\":1411362414,\"url\":\"http://en.wikipedia.org/wiki/Don't_Tell_'Em\"},{\"time_visited\":1411364765,\"url\":\"http://en.wikipedia.org/wiki/Flashing_Lights_(Kanye_West_song)\"},{\"time_visited\":1411364915,\"url\":\"http://en.wikipedia.org/wiki/My_Ride\"},{\"time_visited\":1411364948,\"url\":\"http://en.wikipedia.org/wiki/Birthday_Sex\"},{\"time_visited\":1411365085,\"url\":\"http://en.wikipedia.org/wiki/Jeremih_(album)\"},{\"time_visited\":1411365086,\"url\":\"http://en.wikipedia.org/wiki/Jeremih\"},{\"time_visited\":1411365098,\"url\":\"http://en.wikipedia.org/wiki/I_Like_(Jeremih_song)\"},{\"time_visited\":1411365148,\"url\":\"http://en.wikipedia.org/wiki/Don%27t_Tell_Em\"},{\"time_visited\":1411365153,\"url\":\"http://en.wikipedia.org/wiki/Mick_Schultz\"},{\"time_visited\":1411365168,\"url\":\"http://en.wikipedia.org/wiki/Down_on_Me_(Jeremih_song)\"},{\"time_visited\":1411365469,\"url\":\"http://en.wikipedia.org/wiki/House_of_Balloons\"},{\"time_visited\":1411366113,\"url\":\"http://en.wikipedia.org/wiki/Neo_soul\"},{\"time_visited\":1411366169,\"url\":\"http://en.wikipedia.org/wiki/PBR%26B\"},{\"time_visited\":1411366608,\"url\":\"http://en.wikipedia.org/wiki/The_Weeknd\"},{\"time_visited\":1411366812,\"url\":\"http://en.wikipedia.org/wiki/How_to_Dress_Well\"},{\"time_visited\":1411366823,\"url\":\"http://en.wikipedia.org/wiki/Shlohmo\"},{\"time_visited\":1411367062,\"url\":\"http://en.wikipedia.org/wiki/List_of_First_Ladies_of_the_United_States\"},{\"time_visited\":1411367724,\"url\":\"http://en.wikipedia.org/wiki/Florence_Kling_Harding\"},{\"time_visited\":1411367882,\"url\":\"http://en.wikipedia.org/wiki/Rachel_Jackson\"},{\"time_visited\":1411367904,\"url\":\"http://en.wikipedia.org/wiki/Resentment_(song)\"},{\"time_visited\":1411368001,\"url\":\"http://en.wikipedia.org/wiki/Florence_Harding\"},{\"time_visited\":1411368644,\"url\":\"http://en.wikipedia.org/wiki/List_of_children_of_the_Presidents_of_the_United_States\"},{\"time_visited\":1411368661,\"url\":\"http://en.wikipedia.org/wiki/Philippa_Foot\"},{\"time_visited\":1411368675,\"url\":\"http://en.wikipedia.org/wiki/Grover_Cleveland\"},{\"time_visited\":1411368705,\"url\":\"http://en.wikipedia.org/wiki/Beyonc%C3%A9_discography\"},{\"time_visited\":1411709234,\"url\":\"http://en.wikipedia.org/wiki/Datalog\"},{\"time_visited\":1411709240,\"url\":\"http://en.wikipedia.org/wiki/Datomic\"},{\"time_visited\":1411841695,\"url\":\"https://en.wikipedia.org/wiki/Fully_qualified_domain_name\"},{\"time_visited\":1411862665,\"url\":\"http://en.wikipedia.org/wiki/List_of_HTTP_status_codes\"},{\"time_visited\":1411864323,\"url\":\"http://en.wikipedia.org/wiki/Wikipedia:Random\"},{\"time_visited\":1411864326,\"url\":\"http://en.wikipedia.org/wiki/Cause_and_Effect_(Star_Trek:_The_Next_Generation)\"},{\"time_visited\":1411864742,\"url\":\"http://en.wikipedia.org/wiki/Deyhuk_Rural_District\"},{\"time_visited\":1411864754,\"url\":\"http://en.wikipedia.org/wiki/Iran\"},{\"time_visited\":1411864801,\"url\":\"http://en.wikipedia.org/wiki/Strait_of_Hormuz\"},{\"time_visited\":1411864806,\"url\":\"http://en.wikipedia.org/wiki/Strait_of_Hormuz#mediaviewer/File:Hormuz_map.png\"},{\"time_visited\":1411902413,\"url\":\"http://en.wikipedia.org/wiki/Korma\"}],\"trip_id\":3}")

(defn trip-graphs
  [trip-json-string]
  (let [trip (get (json/read-str trip-json-string) "visits")]
    (str (html
          [:h1.small-text-center "Time Per Page"]
          [:div#chart-container {:style "width:100%;height:500px;"}])
         (reduce
          str
          (for [visit trip]
            (html
             [:h2 (parse-title-from-url (get visit "url"))]
             [:p (pretty-date (get visit "time_visited"))]
             [:div#secret-data {:style "display:none;"} trip-json-string]))))))
