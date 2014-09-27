(ns wikihole.templates
  (:require [wikihole.custom-css :as custom-css]))

(use 'hiccup.core 'hiccup.page 'hiccup.form)

;;;;;;;;; Hiccup documentation: https://github.com/weavejester/hiccup

(defn head
  "Builds <head>"
  [title]
  [:head [:title title]
   (custom-css/google-font-tag)
   (include-css "/stylesheets/normalize.css" "/stylesheets/foundation.min.css" "/stylesheets/main.css")
   (include-js "/javascripts/main.js")])

(defn navigation
  "Builds the navigation menu used site-wite"
  []
  (html [:nav.top-bar
         [:ul.title-area
          [:li.name [:h1 [:a {:href "/"} "Down the Wikihole!"]]]]
         [:section.top-bar-section
          [:ul.right
           [:li ;; TODO make page
            [:a {:href "#"} "About"]]
           [:li ;; TODO make page, make conditional
            [:a {:href "#"} "Dashboard"]]
           [:li ;; TODO make conditional
            [:a {:href "/signup"} "Signup"]]]]]))

(defn default
  "Default template. Wraps content argument in HTML5 doc."
  [content]
  (html
   (html5
    (head "Down the Wikihole!")
    [:body
     (navigation)
     content])))

(defn signup-form
  "Builds the HTML for a signup form"
  []
  (html (form-to [:post "/signup"]
                 (label "username" "Username")
                 (text-field "username")
                 (label "password" "Password")
                 (password-field "password")
                 (submit-button {:class "button primary"} "Signup"))))

(defn index
  []
  (default (html [:h1 "Welcome to the Wikihole!"]
                 [:p (str "Enjoy your ride."
                          " We'll chart your adventures.")])))

(defn signup
  []
  (default (signup-form)))

(defn signup-complete
  [username]
  (default (str "Thanks for signing up, " username "!")))

(defn user-index
  [id]
  (default (str "Hello, User " id "!")))
