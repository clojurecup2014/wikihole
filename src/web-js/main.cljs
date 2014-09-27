; In console, run: hello.greet("ClojureScript");
(ns hello)
(defn ^:export greet [n]
  (str "Howdy, " n))
