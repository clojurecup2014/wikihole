(ns wikihole.pluginjs)

(enable-console-print!)

(def wiki-title "Wikipedia, the free encyclopedia")

(defn days-ago
  [days]
  (- (.getTime (js/Date.)) (* 1000 60 60 24 days)))

(defn search-object
  [days]
  (js-obj "text" (str " - " wiki-title) "startTime" (days-ago days)))

(defn clean-title
  [unclean-title]
  (.replace unclean-title (str " - " wiki-title) ""))

(defn process-history [hist]
  (doseq
    [itm hist]
    (if
      (not (= (.-title itm) wiki-title))
      (set!
       (.-innerHTML
        (.getElementById js/document "output"))
       (+ (.-innerHTML
           (.getElementById js/document "output"))
          (str "<li>" (clean-title (.-title itm)) "</li>")))))) ;; :url :title :lastVisitTime

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
