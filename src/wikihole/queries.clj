(ns wikihole.queries
    (:use [korma.core])
    (:require [clojure.string :as str]))

(use 'korma.core)
(use 'korma.db)

(defdb prod (postgres {:db "" ;TODO
                       :user ""
                       :password ""
                       ;; optional keys
                       :host "localhost"
                       :port "5432"}))

(declare users trips visits)

(defentity users
  (pk :user_id)
  (entity-fields :user_id)
  (has-many trips))

(defentity trips
    (pk :trip_id)
    (belongs-to users)
    (has-many visits)
    (entity-fields :trip_id))

(defentity visits
    (pk :visit_id)
    (belongs-to trips)
    (entity-fields :url :time_visited))

(defn add-trip!
    [user-id new-trip]
    (let [inserted-trip (insert trips (values {:user_id user-id}))
          new-trip-id (:trip_id inserted-trip)
          trip-values (map #(assoc % :trip_id new-trip-id) (:trip new-trip))]
        (println trip-values)
        (insert visits (values trip-values))))

(defn add-user! []
   (:user_id (first (exec-raw ["insert into users default values returning *"] :results))))

(defn get-user-trips [user-id]
    (select users (with trips (with visits (order :time_visited :ASC))) (where {:user_id user-id})))

(defn get-trip-by-id [trip-id]
    (select trips (with visits (order :time_visited :ASC)) (where {:trip_id trip-id})))