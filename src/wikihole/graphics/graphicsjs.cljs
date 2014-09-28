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

(defn make-time-data
  []
  (let
    [data (.-visits (.parse js/JSON (.-innerHTML (.getElementById js/document "secret-data"))))
     times (array)]
    (doseq [visit data]
      (.push times (.-time_visited visit)))
    times))

(defn remove-last
  [arr]
  (.splice arr -1 1)
  arr)

(defn make-per-page-data
  []
  (let
    [data (.-visits (.parse js/JSON (.-innerHTML (.getElementById js/document "secret-data"))))
     times (make-time-data)
     times-on-page (array)]
    (doseq [visit data]
      (let [idx (.indexOf times (.-time_visited visit))]
        (.push times-on-page (- (nth times (+ idx 1) (.-time_visited visit)) (.-time_visited visit)))))
    (remove-last times-on-page)))

(defn draw-times-per-page
  []
  (if
    js/Raphael
    (let
      [color1 "#219ae0" ;; blue
       color2 "#b300bc" ;; magenta
       color3 "#00bc8d" ;; green
       label-text-opts (js-obj "font-weight" "bold" "font-size" "13px")
       x-label "Time of Lookup"
       y-label "Time Spent on Page"
       xdata (remove-last (make-time-data))
       ydata (make-per-page-data)
       paper (js/Raphael. "chart-container" 500 500)]
      (. paper linechart
         60 10 800 330 xdata ydata
         (js-obj "gutter" 20 "nostroke" false
                 "axis" "0 0 0 1" "axisystep" 10
                 "symbol" "circle" "smooth" true
                 "width" 1.2
                 "colors" (array color1 color2 color3))))))

(defn init
  []
  (if (and js/document
           (.-getElementById js/document)
           (.getElementById js/document "secret-data")
           (.getElementById js/document "chart-container"))
   (do
     (draw-times-per-page))))

(set! (.-onload js/window) init)
