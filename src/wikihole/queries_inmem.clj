(ns wikihole.queries_inmem)

(defonce trip-id-seq (atom 0))
(defonce user-id-seq (atom 0))
(defonce db (atom ()))

(defn add-trip! [user-id new-trip]
  (let [trip-id (swap! trip-id-seq inc)
        trip-record (assoc new-trip :user user-id :id trip-id)]
    (swap! db conj trip-record)
    (println (str "in add trip: " @db))
    trip-id))
    
(defn add-user! []
    (let [user-id (swap! trip-id-seq inc)]
   user-id
    ))

(defn get-user-trips [user-id]
    (filter #(== user-id (:user %)) @db))

(defn get-trip-by-id [trip-id]
        (first (filter #(== trip-id (:id %)) @db)))