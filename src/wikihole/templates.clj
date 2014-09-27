(ns wikihole.templates)

(use 'hiccup.core 'hiccup.page)

(defn head
  []
  (html [:head [:title "Down the Wikihole!"]]))

(defn body
  []
  (html [:body [:h1 "Welcome to the Wikihole!"]
         [:p "Enjoy your ride. We'll chart your adventures."]]))

(defn default
  []
  (html (html5 (head) (body))))
