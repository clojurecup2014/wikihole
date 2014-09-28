(ns wikihole.templates
  (:require [wikihole.customcss :as customcss]
            [wikihole.graphics :as graphics]
            [clojure.data.json :as json])
  (:use [hiccup.core]
        [hiccup.page]
        [hiccup.form]))


;;;;;;;;;;;;;;;;;;;;
;;;;; TODO !!!!!
;;;;;;;;;;;;;;;;;;;;

(def download-link "#")
(def about-link "#")

;;;;;;;;; Hiccup documentation: https://github.com/weavejester/hiccup

(defn head
  "Builds <head>"
  [title]
  [:head [:title title]
   (customcss/google-font-tag)
   (include-css "/stylesheets/normalize.css" "/stylesheets/foundation.min.css" "/stylesheets/main.css")
   (include-js "/javascripts/raphael.min.js" "/javascripts/main.js")])

(defn navigation
  "Builds the navigation menu used site-wide"
  []
  (html [:nav.top-bar
         [:ul.title-area
          [:li.name [:h1 [:a {:href "/"} "Down the Wikihole!"]]]]
         [:section.top-bar-section
          [:ul.right
           ;;[:li
           ;; [:a {:href about-link} "About"]]
           [:li
            [:a {:href download-link} "Download Plugin"]]]]]))

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
                        [:a.button.large {:href download-link} "Download Plugin"]]]))
      (html
       [:h3.small-text-center {:style "margin-bottom:30px;"} "Enjoy the ride. We'll chart your adventures."]
       [:p.small-12.medium-8.columns.medium-centered.small-text-center
        (str "Document the fun times you had looking up something for work/school, "
             "and then, hours later, finding yourself on a page about dinosaurs.")]))))

(defn signup
  []
  (default "Sign up" (signup-form)))

(defn signup-complete
  [username]
  (default "Signup Complete" (str "Thanks for signing up, " username "!")))

(defn four-o-four
  []
  (default
    "404 Not Found"
    (html
     [:div.row
      [:div.small-12.columns.small-text-center
       [:p.small-text-center "Couldn't find what you were looking for."]
       [:a.button.large {:href "/"} "Go Back Home"]]])))

;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;; TODO!!!!
;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;; use instead (json/write-str (data-access/get-usertrips id)), etc.

(def test-trips-json-string "[{\"trips\":[{\"visits\":[],\"trip_id\":1},{\"visits\":[],\"trip_id\":2},{\"visits\":[{\"time_visited\":1411337214,\"url\":\"http://en.wikipedia.org/wiki/Mole_rat\"},{\"time_visited\":1411339555,\"url\":\"http://en.wikipedia.org/wiki/INI_file\"},{\"time_visited\":1411344171,\"url\":\"http://en.wikipedia.org/wiki/Rae_Sremmurd\"},{\"time_visited\":1411345695,\"url\":\"http://en.wikipedia.org/wiki/P-Poppin\"},{\"time_visited\":1411347150,\"url\":\"http://en.wikipedia.org/wiki/Emotion_(Samantha_Sang_song)\"},{\"time_visited\":1411348269,\"url\":\"http://en.wikipedia.org/wiki/Wikipedia:Wiki_Game\"},{\"time_visited\":1411350072,\"url\":\"http://en.wikipedia.org/wiki/Jeremih_discography\"},{\"time_visited\":1411350144,\"url\":\"http://en.wikipedia.org/wiki/List_of_Billboard_Hot_100_top_10_singles_in_2009\"},{\"time_visited\":1411350460,\"url\":\"http://en.wikipedia.org/wiki/The_Weeknd_discography\"},{\"time_visited\":1411350727,\"url\":\"http://en.wikipedia.org/wiki/Imma_Star_(Everywhere_We_Are)\"},{\"time_visited\":1411355712,\"url\":\"http://en.wikipedia.org/wiki/Little_Big_Man_(film)\"},{\"time_visited\":1411361088,\"url\":\"http://en.wikipedia.org/wiki/Unforgiven\"},{\"time_visited\":1411362414,\"url\":\"http://en.wikipedia.org/wiki/Don't_Tell_'Em\"},{\"time_visited\":1411364765,\"url\":\"http://en.wikipedia.org/wiki/Flashing_Lights_(Kanye_West_song)\"},{\"time_visited\":1411364915,\"url\":\"http://en.wikipedia.org/wiki/My_Ride\"},{\"time_visited\":1411364948,\"url\":\"http://en.wikipedia.org/wiki/Birthday_Sex\"},{\"time_visited\":1411365085,\"url\":\"http://en.wikipedia.org/wiki/Jeremih_(album)\"},{\"time_visited\":1411365086,\"url\":\"http://en.wikipedia.org/wiki/Jeremih\"},{\"time_visited\":1411365098,\"url\":\"http://en.wikipedia.org/wiki/I_Like_(Jeremih_song)\"},{\"time_visited\":1411365148,\"url\":\"http://en.wikipedia.org/wiki/Don%27t_Tell_Em\"},{\"time_visited\":1411365153,\"url\":\"http://en.wikipedia.org/wiki/Mick_Schultz\"},{\"time_visited\":1411365168,\"url\":\"http://en.wikipedia.org/wiki/Down_on_Me_(Jeremih_song)\"},{\"time_visited\":1411365469,\"url\":\"http://en.wikipedia.org/wiki/House_of_Balloons\"},{\"time_visited\":1411366113,\"url\":\"http://en.wikipedia.org/wiki/Neo_soul\"},{\"time_visited\":1411366169,\"url\":\"http://en.wikipedia.org/wiki/PBR%26B\"},{\"time_visited\":1411366608,\"url\":\"http://en.wikipedia.org/wiki/The_Weeknd\"},{\"time_visited\":1411366812,\"url\":\"http://en.wikipedia.org/wiki/How_to_Dress_Well\"},{\"time_visited\":1411366823,\"url\":\"http://en.wikipedia.org/wiki/Shlohmo\"},{\"time_visited\":1411367062,\"url\":\"http://en.wikipedia.org/wiki/List_of_First_Ladies_of_the_United_States\"},{\"time_visited\":1411367724,\"url\":\"http://en.wikipedia.org/wiki/Florence_Kling_Harding\"},{\"time_visited\":1411367882,\"url\":\"http://en.wikipedia.org/wiki/Rachel_Jackson\"},{\"time_visited\":1411367904,\"url\":\"http://en.wikipedia.org/wiki/Resentment_(song)\"},{\"time_visited\":1411368001,\"url\":\"http://en.wikipedia.org/wiki/Florence_Harding\"},{\"time_visited\":1411368644,\"url\":\"http://en.wikipedia.org/wiki/List_of_children_of_the_Presidents_of_the_United_States\"},{\"time_visited\":1411368661,\"url\":\"http://en.wikipedia.org/wiki/Philippa_Foot\"},{\"time_visited\":1411368675,\"url\":\"http://en.wikipedia.org/wiki/Grover_Cleveland\"},{\"time_visited\":1411368705,\"url\":\"http://en.wikipedia.org/wiki/Beyonc%C3%A9_discography\"},{\"time_visited\":1411709234,\"url\":\"http://en.wikipedia.org/wiki/Datalog\"},{\"time_visited\":1411709240,\"url\":\"http://en.wikipedia.org/wiki/Datomic\"},{\"time_visited\":1411841695,\"url\":\"https://en.wikipedia.org/wiki/Fully_qualified_domain_name\"},{\"time_visited\":1411862665,\"url\":\"http://en.wikipedia.org/wiki/List_of_HTTP_status_codes\"},{\"time_visited\":1411864323,\"url\":\"http://en.wikipedia.org/wiki/Wikipedia:Random\"},{\"time_visited\":1411864326,\"url\":\"http://en.wikipedia.org/wiki/Cause_and_Effect_(Star_Trek:_The_Next_Generation)\"},{\"time_visited\":1411864742,\"url\":\"http://en.wikipedia.org/wiki/Deyhuk_Rural_District\"},{\"time_visited\":1411864754,\"url\":\"http://en.wikipedia.org/wiki/Iran\"},{\"time_visited\":1411864801,\"url\":\"http://en.wikipedia.org/wiki/Strait_of_Hormuz\"},{\"time_visited\":1411864806,\"url\":\"http://en.wikipedia.org/wiki/Strait_of_Hormuz#mediaviewer/File:Hormuz_map.png\"},{\"time_visited\":1411902413,\"url\":\"http://en.wikipedia.org/wiki/Korma\"}],\"trip_id\":3}],\"user_id\":1}]")
(def test-trip-json-string "{\"visits\":[{\"time_visited\":1411337214,\"url\":\"http://en.wikipedia.org/wiki/Mole_rat\"},{\"time_visited\":1411339555,\"url\":\"http://en.wikipedia.org/wiki/INI_file\"},{\"time_visited\":1411344171,\"url\":\"http://en.wikipedia.org/wiki/Rae_Sremmurd\"},{\"time_visited\":1411345695,\"url\":\"http://en.wikipedia.org/wiki/P-Poppin\"},{\"time_visited\":1411347150,\"url\":\"http://en.wikipedia.org/wiki/Emotion_(Samantha_Sang_song)\"},{\"time_visited\":1411348269,\"url\":\"http://en.wikipedia.org/wiki/Wikipedia:Wiki_Game\"},{\"time_visited\":1411350072,\"url\":\"http://en.wikipedia.org/wiki/Jeremih_discography\"},{\"time_visited\":1411350144,\"url\":\"http://en.wikipedia.org/wiki/List_of_Billboard_Hot_100_top_10_singles_in_2009\"},{\"time_visited\":1411350460,\"url\":\"http://en.wikipedia.org/wiki/The_Weeknd_discography\"},{\"time_visited\":1411350727,\"url\":\"http://en.wikipedia.org/wiki/Imma_Star_(Everywhere_We_Are)\"},{\"time_visited\":1411355712,\"url\":\"http://en.wikipedia.org/wiki/Little_Big_Man_(film)\"},{\"time_visited\":1411361088,\"url\":\"http://en.wikipedia.org/wiki/Unforgiven\"},{\"time_visited\":1411362414,\"url\":\"http://en.wikipedia.org/wiki/Don't_Tell_'Em\"},{\"time_visited\":1411364765,\"url\":\"http://en.wikipedia.org/wiki/Flashing_Lights_(Kanye_West_song)\"},{\"time_visited\":1411364915,\"url\":\"http://en.wikipedia.org/wiki/My_Ride\"},{\"time_visited\":1411364948,\"url\":\"http://en.wikipedia.org/wiki/Birthday_Sex\"},{\"time_visited\":1411365085,\"url\":\"http://en.wikipedia.org/wiki/Jeremih_(album)\"},{\"time_visited\":1411365086,\"url\":\"http://en.wikipedia.org/wiki/Jeremih\"},{\"time_visited\":1411365098,\"url\":\"http://en.wikipedia.org/wiki/I_Like_(Jeremih_song)\"},{\"time_visited\":1411365148,\"url\":\"http://en.wikipedia.org/wiki/Don%27t_Tell_Em\"},{\"time_visited\":1411365153,\"url\":\"http://en.wikipedia.org/wiki/Mick_Schultz\"},{\"time_visited\":1411365168,\"url\":\"http://en.wikipedia.org/wiki/Down_on_Me_(Jeremih_song)\"},{\"time_visited\":1411365469,\"url\":\"http://en.wikipedia.org/wiki/House_of_Balloons\"},{\"time_visited\":1411366113,\"url\":\"http://en.wikipedia.org/wiki/Neo_soul\"},{\"time_visited\":1411366169,\"url\":\"http://en.wikipedia.org/wiki/PBR%26B\"},{\"time_visited\":1411366608,\"url\":\"http://en.wikipedia.org/wiki/The_Weeknd\"},{\"time_visited\":1411366812,\"url\":\"http://en.wikipedia.org/wiki/How_to_Dress_Well\"},{\"time_visited\":1411366823,\"url\":\"http://en.wikipedia.org/wiki/Shlohmo\"},{\"time_visited\":1411367062,\"url\":\"http://en.wikipedia.org/wiki/List_of_First_Ladies_of_the_United_States\"},{\"time_visited\":1411367724,\"url\":\"http://en.wikipedia.org/wiki/Florence_Kling_Harding\"},{\"time_visited\":1411367882,\"url\":\"http://en.wikipedia.org/wiki/Rachel_Jackson\"},{\"time_visited\":1411367904,\"url\":\"http://en.wikipedia.org/wiki/Resentment_(song)\"},{\"time_visited\":1411368001,\"url\":\"http://en.wikipedia.org/wiki/Florence_Harding\"},{\"time_visited\":1411368644,\"url\":\"http://en.wikipedia.org/wiki/List_of_children_of_the_Presidents_of_the_United_States\"},{\"time_visited\":1411368661,\"url\":\"http://en.wikipedia.org/wiki/Philippa_Foot\"},{\"time_visited\":1411368675,\"url\":\"http://en.wikipedia.org/wiki/Grover_Cleveland\"},{\"time_visited\":1411368705,\"url\":\"http://en.wikipedia.org/wiki/Beyonc%C3%A9_discography\"},{\"time_visited\":1411709234,\"url\":\"http://en.wikipedia.org/wiki/Datalog\"},{\"time_visited\":1411709240,\"url\":\"http://en.wikipedia.org/wiki/Datomic\"},{\"time_visited\":1411841695,\"url\":\"https://en.wikipedia.org/wiki/Fully_qualified_domain_name\"},{\"time_visited\":1411862665,\"url\":\"http://en.wikipedia.org/wiki/List_of_HTTP_status_codes\"},{\"time_visited\":1411864323,\"url\":\"http://en.wikipedia.org/wiki/Wikipedia:Random\"},{\"time_visited\":1411864326,\"url\":\"http://en.wikipedia.org/wiki/Cause_and_Effect_(Star_Trek:_The_Next_Generation)\"},{\"time_visited\":1411864742,\"url\":\"http://en.wikipedia.org/wiki/Deyhuk_Rural_District\"},{\"time_visited\":1411864754,\"url\":\"http://en.wikipedia.org/wiki/Iran\"},{\"time_visited\":1411864801,\"url\":\"http://en.wikipedia.org/wiki/Strait_of_Hormuz\"},{\"time_visited\":1411864806,\"url\":\"http://en.wikipedia.org/wiki/Strait_of_Hormuz#mediaviewer/File:Hormuz_map.png\"},{\"time_visited\":1411902413,\"url\":\"http://en.wikipedia.org/wiki/Korma\"}],\"trip_id\":3}")

(defn user-index
  [id]
  (default
    "Your Wikihole Trips"
    (graphics/user-graphs test-trips-json-string)))

(defn trip-index
  [id]
  (default
    "Your Trip Down the Wikihole"
    (graphics/trip-graphs id test-trip-json-string)))
