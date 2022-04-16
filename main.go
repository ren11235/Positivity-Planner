package main

import (
	//"path"
	//"path/filepath"
	//"github.com/gin-gonic/gin"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	"github.com/rs/cors"

	//"os"

	//"github.com/ren11235/Positivity-Planner/handlers"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/google/uuid"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func main() {
	//pass := os.Getenv("DB_PASS")

	fmt.Println("test1")
	db, err := gorm.Open("sqlite3", "./planner.db")
	fmt.Println("test2")
	//db, err := gorm.Open(sqlite.Open("planner.db"), &gorm.Config{})
	if err != nil {
		panic(err.Error())
	}
	fmt.Println("test3")
	app := App{
		db: db,
		r:  mux.NewRouter(),
	}
	fmt.Println("test4")
	app.start()
	fmt.Println("test5")
}

//type event struct {
//ID   string `gorm:"primary_key" json:"id"`
//Name string `json:"name"`
//Time string `json:"time"`
//}

type event struct {
	ID    string `gorm:"primary_key" json:"id"`
	Title string `json:"title"`
	Start string `json:"start"`
	End   string `json:"end"`
}
type App struct {
	db *gorm.DB
	r  *mux.Router
}

func (a *App) start() {
	fmt.Println("test6")

	a.db.AutoMigrate(&event{})
	fmt.Println("test7")
	a.r.HandleFunc("/planner", a.getAllEvents).Methods("GET")
	a.r.HandleFunc("/planner", a.addEvent).Methods("POST")
	a.r.HandleFunc("/planner/{id}", a.updateEvent).Methods("PUT")
	a.r.HandleFunc("/planner/{id}", a.deleteEvent).Methods("DELETE")
	a.r.PathPrefix("/").Handler(http.FileServer(http.Dir("./webapp/dist/webapp/")))
	fmt.Println("test8")
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:4200", "http://localhost:*"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "DELETE", "UPDATE"},
	})

	handler := c.Handler(a.r)
	log.Fatal(http.ListenAndServe(":3000", handler))
	//log.Fatal(http.ListenAndServe(":3000", a.r))
	fmt.Println("test9")
}

func (a *App) getAllEvents(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Getting All Events")
	w.Header().Set("Content-Type", "application/json")
	var all []event
	err := a.db.Find(&all).Error
	if err != nil {
		sendErr(w, http.StatusInternalServerError, err.Error())
		return
	}
	err = json.NewEncoder(w).Encode(all)
	if err != nil {
		sendErr(w, http.StatusInternalServerError, err.Error())
	}
}

func (a *App) addEvent(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Adding Event")
	w.Header().Set("Content-Type", "application/json")
	var s event
	err := json.NewDecoder(r.Body).Decode(&s)
	if err != nil {
		sendErr(w, http.StatusBadRequest, err.Error())
		return
	}
	s.ID = uuid.New().String()
	err = a.db.Save(&s).Error
	if err != nil {
		sendErr(w, http.StatusInternalServerError, err.Error())
	} else {
		w.WriteHeader(http.StatusCreated)
	}
}

func (a *App) updateEvent(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Updating Event")
	w.Header().Set("Content-Type", "application/json")
	var s event
	err := json.NewDecoder(r.Body).Decode(&s)
	if err != nil {
		sendErr(w, http.StatusBadRequest, err.Error())
		return
	}
	s.ID = mux.Vars(r)["id"]
	err = a.db.Save(&s).Error
	if err != nil {
		sendErr(w, http.StatusInternalServerError, err.Error())
	}
}

func (a *App) deleteEvent(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Deleting Event")
	w.Header().Set("Content-Type", "application/json")
	err := a.db.Unscoped().Delete(event{ID: mux.Vars(r)["id"]}).Error
	if err != nil {
		sendErr(w, http.StatusInternalServerError, err.Error())
	}
}

func sendErr(w http.ResponseWriter, code int, message string) {
	resp, _ := json.Marshal(map[string]string{"error": message})
	http.Error(w, string(resp), code)
}
