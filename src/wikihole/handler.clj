(ns wikihole.handler
  (:require [compojure.core :refer :all]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [wikihole.templates :refer :all]))

(defroutes app-routes
  (GET "/" [] (wikihole.templates/default))
  (route/resources "/")
  (route/not-found "Not Found"))


(def app
  (handler/site app-routes))
