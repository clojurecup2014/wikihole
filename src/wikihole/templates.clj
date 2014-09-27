(ns wikihole.templates)

(use 'hiccup.core 'hiccup.page 'hiccup.form)

(defn head
  "Builds <head>"
  [title]
  [:head [:title title]
         (include-css "/normalize.css" "/foundation.min.css")])

(defn default
  "Default template. Wraps content argument in HTML5 doc."
  [content]
  (html
   (html5
    (head "Down the Wikihole!")
    [:body content])))

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
