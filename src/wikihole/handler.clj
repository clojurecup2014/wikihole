(ns wikihole.handler
  (:require [wikihole.api :refer [rest-api]]
            [wikihole.site :refer [site]]
            [compojure.core :refer [routes]]))

; Combine the site and rest-api
(def app (routes rest-api site))