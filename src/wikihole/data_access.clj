(ns wikihole.data-access
  (:require [clojure.data.json :as json])
  (require [ring.util.response :as r]
  [wikihole.queries :as q]))

(defn save-trip
    [user-id trip]
    (r/created (str "this/will/be/url/for/" (:trip_id (q/add-trip! user-id trip)) "/new/trip")))

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
    (r/created (str "this/will/be/url/for/" (q/add-user!) "/new/user")))