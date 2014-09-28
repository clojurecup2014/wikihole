(ns wikihole.pluginjs
    (:require [clojure.string :as string]))

(def paramStr "userId=0")

(enable-console-print!)

(def wiki-title "Wikipedia, the free encyclopedia")

(def user-id-storage 'wikihole-user-id')

(defn days-ago
  [days]
  (- (.getTime (js/Date.)) (* 1000 60 60 24 days)))

(defn search-object
  [days]
  (js-obj "text" "" "startTime" (days-ago days) "maxResults" 0))

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
        trips (filter #(> (count %) 2) chunks)]
        (println (str "#user id " (.getItem js/localStorage user-id-storage)))
      (doseq
        [trip trips]
          (do
            (set!
            (.-innerHTML
             (.getElementById js/document "output"))
            (+ (.-innerHTML
                (.getElementById js/document "output"))
               (str "<h3>A trip!</h3>" ;todo: a title
                    "<ul>"
                    (clojure.string/join "" (map #(str "<li>" (clean-title (:title %)) "</li>") (reverse trip)))
                    "</ul>")))))))

(def idle-time-limit 300)

(defn reduce-over-visits
   [results visit]
    (let [result-list (first results)
          previous-visit-time (second results)
          current-visit-time (:lastVisitTime visit)
          difference (- current-visit-time previous-visit-time)]
          (cond
                (clojure.string/blank? (:title visit))
                    [result-list current-visit-time] ;anchor links within wikipedia get stored with no title, ignore
                (< (.indexOf (:title visit) wiki-title) 1)
                    [result-list 0] ;break trip chain. todo: break on random, etc
                (> difference idle-time-limit)
                    [(cons (cons visit ()) result-list) current-visit-time] ;start new trip
                :else
                    [(cons (cons visit (first result-list)) (rest result-list)) current-visit-time] ;append to existing trip
                    )))

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

(defn check-for-user
    []
    (do
    (println "checking for user")
    (if (not (.getItem js/localStorage user-id-storage))
        (let [http (js/XMLHttpRequest.)]
          (.open http "POST" "http://wikihole.clojurecup.com/user/new" true)
          (.setRequestHeader http "Content-Type" "application/json")
          (aset http "onreadystatechange" (fn []
                                            (if (== (.-readyState http) 4)
                                                (.setItem js/localStorage user-id-storage
                                                          (aget (.parse js/JSON (.-responseText http)) "user_id")))))
          (.send http (.stringify js/JSON (js-obj "trip" visits)))
          ))))

(defn init []
  (do
    (check-for-user)
    (if (and (and js/document
                (.-getElementById js/document))
           collect-data)
        (let [btn (.getElementById js/document "send-data")]
            (set! (.-onclick btn) collect-data)))))

(set! (.-onload js/window) init)
