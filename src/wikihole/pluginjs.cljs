(ns wikihole.pluginjs)

(enable-console-print!)

(defn days-ago
  [days]
  (- (.getTime (js/Date.)) (* 1000 60 60 24 days)))

(defn search-object
  [days]
  (.log js/console (str "Days ago: " days))
  (js-obj "text" "Wikipedia, the free encyclopedia" "startTime" (days-ago days)))

(defn process-history [hist]
  (doseq [itm hist]
    (set!
     (.-innerHTML
      (.getElementById js/document "output"))
     (+ (.-innerHTML
         (.getElementById js/document "output"))
        (str "<li>" (.-title itm) "</li>"))))) ;; :url :title :lastVisitTime

(defn collect-data
  []
  (let [days-ago (js/parseInt (.-value (.getElementById js/document "num-days")))]
    (if (and js/chrome
             (.-history js/chrome)
             (number? days-ago)
             (> days-ago 0))
      (.search (.-history js/chrome) (search-object days-ago) process-history))))



(defn init []
  (if (and (and js/document
                (.-getElementById js/document))
           collect-data)
    (let [btn (.getElementById js/document "send-data")]
      (set! (.-onclick btn) collect-data))))

(set! (.-onload js/window) init)
