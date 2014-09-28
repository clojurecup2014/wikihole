(ns wikihole.data-access
  (:require [clojure.data.json :as json])
  (require [ring.util.response :as r]
  [wikihole.queries :as q]))

(defn save-trip
    [user-id trip]
    (-> (r/response {:trip_id (q/add-trip! user-id trip)})
        (r/content-type "application/json")))

(defn get-trip
    [trip-id]
    (-> (r/response (q/get-trip-by-id trip-id))
        (r/content-type "application/json")))

(defn get-trips-for-user
    [user-id]
    (-> (r/response (q/get-user-trips user-id))
        (r/content-type "application/json")))

(defn create-user
    []
     (-> (r/response {:user_id (q/add-user!)})
     (r/content-type "application/json")))