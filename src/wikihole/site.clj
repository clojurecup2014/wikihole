(ns wikihole.site
  (:require [compojure.core :refer :all]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [wikihole.templates :as templates]
            [wikihole.graphics :as graphics]))

(defroutes site-routes
  (GET "/" [] (templates/index))
  (GET "/user/:id" [id] (templates/user-index id))
  (GET "/trip/:id/view" [id] (templates/trip-index id))
  (GET "/signup" [] (templates/signup))
  (POST "/signup" [username] (templates/signup-complete username))
  (GET "/test-chart" [] (templates/default "Test Chart" (graphics/test-chart)))
  (route/resources "/")
  (route/not-found "Not Found"))

(def site
  (handler/site site-routes))
