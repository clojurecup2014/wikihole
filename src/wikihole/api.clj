(ns wikihole.api
  (:require [compojure.core :refer :all]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [ring.middleware.json :as middleware]
            [wikihole.data-access :as data-access]
            [clojure.data.json :as json])
  (use clojure.walk))

(defroutes api-routes
  (POST ["/user/:userId/trip", :userId #"[0-9]+"] {params :params body :body} (do (println (str "##body: " (doall (keywordize-keys body)))) (data-access/save-trip (read-string (:userId params)) (keywordize-keys body))))
  (GET ["/trip/:tripId", :tripId #"[0-9]+"] [tripId] (data-access/get-trip (read-string tripId)))
  (GET ["/user/:userId/trips", :userId #"[0-9]+"] [userId] (data-access/get-trips-for-user (read-string userId)))
  (POST "/user/new" [] (data-access/create-user)))

(defn allow-cross-origin
    "middleware function to allow cross origin"
    [handler]
    (fn [request]
     (let [response (handler request)]
        (-> response
        (assoc-in [:headers "Access-Control-Allow-Origin"] "*")
        (assoc-in [:headers "Access-Control-Allow-Headers"] "Origin, X-Requested-With, Content-Type, Accept")))))

(def rest-api
  (-> (handler/api api-routes)
        (middleware/wrap-json-body)
        (middleware/wrap-json-response)
        (allow-cross-origin)))