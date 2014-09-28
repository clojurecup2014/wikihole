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
       label-text-opts (js-obj "font-weight" "bold" "font-size" "16px")
       x-label "Time of Lookup"
       y-label "Time Spent on Page (minutes)"
       gutter 20
       x 130
       y 10
       xlen 800
       ylen 330
       xdata (remove-last (make-time-data))
       ydata (.map (make-per-page-data) (fn [itm] (/ (/ itm 1000.0) 60.0)))
       paper (js/Raphael. "chart-container" 500 500)
       x-label (.text paper (+ (/ xlen 1.7) (* 2 gutter)) (+ ylen (* 1.8 gutter)) x-label)
       y-label (.text paper (* 4.5 gutter) (/ ylen 2) y-label)
       chart (. paper linechart
                x y xlen ylen xdata ydata
                (js-obj "gutter" gutter "nostroke" false
                        "axis" "0 0 1 1" "axisystep" 10
                        "symbol" "circle" "smooth" true
                        "width" 2
                        "colors" (array color1 color2 color3)))]

      (.attr x-label label-text-opts)
      (.attr y-label label-text-opts)
      (.transform y-label "R270"))))

(defn init
  []
  (if (and js/document
           (.-getElementById js/document)
           (.getElementById js/document "secret-data")
           (.getElementById js/document "chart-container"))
   (do
     (draw-times-per-page))))

(set! (.-onload js/window) init)
