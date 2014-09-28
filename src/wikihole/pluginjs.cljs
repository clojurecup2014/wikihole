(ns wikihole.pluginjs
    (:require [clojure.string :as string]))

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

(defn time-to-millis
  [weird-chrome-time]
  (.floor js/Math (/ weird-chrome-time 1000)))

(defn process-history [hist]
  (let [visits (array)
        clojurized-hist (js->clj hist :keywordize-keys true) ;todo: filter special wiki content
        hist-in-seconds (map #(update-in % [:lastVisitTime] time-to-millis) clojurized-hist)
        chunks (break-into-trips hist-in-seconds)
        trips (filter #(> (count %) 1) chunks)]
      (doseq
        [trip trips]
          (do
            (set!
            (.-innerHTML
             (.getElementById js/document "output"))
            (+ (.-innerHTML
                (.getElementById js/document "output"))
               (str "<h3>A trip</h3>" ;todo: a title
                    "<ul>"
                    (clojure.string/join "" (map #(str "<li>" (clean-title (:title %)) "</li>") trip))
                    "</ul>")))))))

(def idle-time-limit 300)

(defn reduce-over-visits
   [results visit]
    (let [result-list (first results)
          previous-visit-time (second results)
          current-visit-time (:lastVisitTime visit)
          difference (- current-visit-time previous-visit-time)
          new-result-list (if (> difference idle-time-limit) ;todo: break on homepage, random, etc
                              (cons (cons visit ()) result-list) ;start new trip
                              (cons (cons visit (first result-list)) (rest result-list)))] ;append to existing trip
            [new-result-list current-visit-time]
          ))

(defn break-into-trips
    [visits]
    (first (reduce reduce-over-visits [() 0] (reverse visits))))

 ;   (.push visits (js-obj "time_visited" (.floor js/Math (/ (.-lastVisitTime itm) 1000)) "url" (.-url itm)))
(defn send-visits [visits]
 ; (doseq [vs visits]
 ;  (println visits)
  (let [http (js/XMLHttpRequest.)]
    (.open http "POST" "http://wikihole.clojurecup.com/user/1/trip" true)
    (.setRequestHeader http "Content-Type" "application/json")
    (.send http (.stringify js/JSON (js-obj "trip" visits)))))

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
