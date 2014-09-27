(ns wikihole.site
  (:require [compojure.core :refer :all]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [wikihole.templates :as templates]
            [wikihole.graphics :as graphics]))

;; We need sessions and users!
;; Something we can use for sessions:
;; https://github.com/ring-clojure/ring/blob/master/ring-core/src/ring/middleware/session.clj
(defroutes site-routes
  (GET "/" [] (templates/index))
  (GET "/user/:id" [id] (templates/user-index id))
  (GET "/signup" [] (templates/signup))
  (POST "/signup" [username] (templates/signup-complete username))
  (GET "/test-chart" [] (templates/default "Test Chart" (graphics/test)))
  (route/resources "/")
  (route/not-found "Not Found"))

(def site
  (handler/site site-routes))
