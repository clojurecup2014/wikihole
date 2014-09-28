(ns wikihole.pluginjs)

(def paramStr "userId=0")

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
  (let [visits (array)]
   (doseq
    [itm hist]
    (if
      (not (= (.-title itm) wiki-title))
      (do
        (set!
        (.-innerHTML
         (.getElementById js/document "output"))
        (+ (.-innerHTML
            (.getElementById js/document "output"))
           (str "<li>" (clean-title (.-title itm)) "</li>")))
        (.push visits (js-obj "time_visited" (.-lastVisitTime itm) "url" (.-url itm))))))
    (send-visits visits)))

(defn send-visits [visits]
  ;;(doseq [vs visits]
  ;;  (println (.-url vs)))
  (let [http (js/XMLHttpRequest.)]
    (.open http "POST" "http://localhost:3000/user/1/trip" true)
    (.setRequestHeader http "Content-Type" "application/json")
    (.send http visits)))

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
