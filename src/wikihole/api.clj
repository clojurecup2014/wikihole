(ns wikihole.api
  (:require [compojure.core :refer :all]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [ring.middleware.json :as middleware]
            [wikihole.data-access :as data-access]))

(defroutes api-routes
  (POST "/user/:userId/trip" {params :params body :body} (data-access/save-trip (:userId params) body))
  (GET "/trip/:tripId" [tripId] (data-access/get-trip tripId))
  (GET "/user/:userId/trips" [userId] (data-access/get-trips-for-user userId)))


(def rest-api
  (-> (handler/api api-routes)
        (middleware/wrap-json-body)
        (middleware/wrap-json-response)))