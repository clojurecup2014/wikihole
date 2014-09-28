(ns wikihole.data-access
  (:require [clojure.data.json :as json])
  (require [ring.util.response :as r]
  [wikihole.queries :as q]))

(defn save-trip
    [user-id trip]
    (println (str "#" trip))
    (r/created (str "this/will/be/url/for/" (q/add-trip! user-id trip) "/new/trip"))) ;TODO

(def dummy-trip
    (json/write-str {   :user 1
                        :trip [{:url "http://en.wikipedia.org/wiki/Deyhuk_Rural_District" :timestamp 1411864568000}
                            {:url "http://en.wikipedia.org/wiki/Iran" :timestamp 1411864598000}
                            {:url "http://en.wikipedia.org/wiki/Strait_of_Hormuz" :timestamp 1411864668000}]}))

(defn get-trip
    [trip-id]
    (-> (r/response (q/get-trip-by-id trip-id))
        (r/content-type "application/json")))

(def dummy-trips
   (json/write-str {:trips [1,2,3,4,5]})) ;TODO: return generated trip names like "Deyhuk Rural District to Strait of Hormuz"?

(defn get-trips-for-user
    [user-id]
    (-> (r/response (q/get-user-trips user-id))
        (r/content-type "application/json")))

(defn create-user
    []
    (r/created (str "this/will/be/url/for/" (q/add-user!) "/new/user"))) ;TODO)