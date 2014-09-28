(ns wikihole.graphicsjs)

(defn time-with-per-page
  "trip arg is a vector of maps with 'time_visited' and 'url' string keys"
  [trip]
  (let
    [names (map (fn [visit] (parse-title-from-url (get visit "url"))) (butlast trip))
     times (map (fn [visit] (get visit "time_visited")) trip)
     time-per-page (butlast
                    (map-indexed (fn
                                   [idx itm]
                                   (- (nth times (+ idx 1) itm) itm))
                                 times))]
    (vec (map vector (butlast times) time-per-page))))

(defn draw
  []
  (if
    js/Raphael
    (let [paper (js/Raphael. "chart-container" 500 500)]
      (. paper piechart 320 240 100 (array 320 240 100)))))

(defn init
  []
  (if (and js/document
           (.-getElementById js/document)
           (.getElementById js/document "secret-data")
           (.getElementById js/document "chart-container"))
   (do
     (.log js/console (.-innerHTML (.getElementById js/document "secret-data")))
     (draw))))

(set! (.-onload js/window) init)
