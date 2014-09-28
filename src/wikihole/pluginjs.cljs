(ns wikihole.pluginjs)

(enable-console-print!)

(def default-days-ago 7)

(defn days-ago
  [days]
  (- (.getTime (js/Date.)) (* 1000 60 60 24 days)))

(defn search-object
  [days]
  (.log js/console (str "Days ago: " days))
  (js-obj "text" "Wikipedia, the free encyclopedia" "startTime" (days-ago days)))

(defn callback-fn [stuff] (.log js/console stuff))

(defn collect-data
  []
  (let [days-ago (js/parseInt (.-value (.getElementById js/document "num-days")))]
    (if (and js/chrome
             (.-history js/chrome)
             (number? days-ago)
             (> days-ago 0))
        (.search (.-history js/chrome) (search-object days-ago) callback-fn))))

(defn init []
  (if (and (and js/document
                (.-getElementById js/document))
           collect-data)
    (let [btn (.getElementById js/document "send-data")]
      (set! (.-onclick btn) collect-data))))

(set! (.-onload js/window) init)
