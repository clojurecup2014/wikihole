(ns wikihole.handler
  (:require [compojure.core :refer :all]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [wikihole.templates :as templates]))

;; We need sessions and users!
;; Something we can use for sessions:
;; https://github.com/ring-clojure/ring/blob/master/ring-core/src/ring/middleware/session.clj
(defroutes app-routes
  (GET "/" [] (templates/index))
  (GET "/user/:id" [id] (templates/user-index id))
  (GET "/signup" [] (templates/signup))
  (POST "/signup" [username] (templates/signup-complete username))
  (route/resources "/")
  (route/not-found "Not Found"))

(def app
  (handler/site app-routes))
