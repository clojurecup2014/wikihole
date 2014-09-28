(ns wikihole.templates
  (:require [wikihole.customcss :as customcss])
  (:use [hiccup.core]
        [hiccup.page]
        [hiccup.form]))

;;;;;;;;; Hiccup documentation: https://github.com/weavejester/hiccup

(defn head
  "Builds <head>"
  [title]
  [:head [:title title]
   (customcss/google-font-tag)
   (include-css "/stylesheets/normalize.css" "/stylesheets/foundation.min.css" "/stylesheets/main.css")
   (include-js "/javascripts/main.js")])

(defn navigation
  "Builds the navigation menu used site-wide"
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

(defn masthead
  ([title]
   (html [:div#masthead
          [:h1.small-text-center title]]))
  ([title content]
   (html [:div#masthead
          [:h1.small-text-center title]
          content])))


(defn default
  "Default template. Wraps content argument in HTML5 doc."
  ([title content]
   (html
    (html5
     (head title)
     [:body
      (navigation)
      (masthead title)
      [:div.row
       [:div.small-12.columns content]]])))
  ([title masthead content]
   (html
    (html5
     (head title)
     [:body
      (navigation)
      masthead
      [:div.row
       [:div.small-12.columns content]]]))))

(defn signup-form
  "Builds the HTML for a signup form"
  []
  (html [:div.small-text-center.small-12.medium-6.columns.medium-centered
         (form-to [:post "/signup"]
                  (label "username" "Username")
                  (text-field "username")
                  (label "password" "Password")
                  (password-field "password")
                  (submit-button {:class "button primary"} "Signup"))]))

(defn index
  []
  (let [title "Welcome to the Wikihole!"]
    (default title
      (masthead title
                (html [:div.row
                       [:div.small-12.columns.small-text-center
                        [:a.button.large {:href "/signup"} "Sign Up"]]]))
      (html
       [:h3.small-text-center "Enjoy the ride. We'll chart your adventures."]
       [:p.small-12.medium-8.columns.medium-centered.small-text-center
        (str "Document the fun times you had looking up something for work/school, "
             "and then, hours later, finding yourself on a page about dinosaurs.")]))))

(defn signup
  []
  (default "Sign up" (signup-form)))

(defn signup-complete
  [username]
  (default "Signup Complete" (str "Thanks for signing up, " username "!")))

(defn user-index
  [id]
  (default (str "Hello, User " id "!")))
