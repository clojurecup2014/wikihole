(ns wikihole.api
  (:require [compojure.core :refer :all]
            [compojure.handler :as handler]
            [compojure.route :as route]))

(defroutes api-routes
  (GET "/trip/:id" [id] (str "trip for " id)))

(def rest-api
  (handler/api api-routes))
