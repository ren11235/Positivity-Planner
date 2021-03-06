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

	db, err := gorm.Open("sqlite3", "./planner.db")

	//db, err := gorm.Open(sqlite.Open("planner.db"), &gorm.Config{})
	if err != nil {
		panic(err.Error())
	}

	app := App{
		db: db,
		r:  mux.NewRouter(),
	}

	app.start()

}

type event struct {
	ID        string `gorm:"primary_key" json:"id"`
	UserID    string `json:"userID"`
	Title     string `json:"title"`
	Start     string `json:"start"`
	End       string `json:"end"`
	Primary   string `json:"primary"`
	Secondary string `json:"secondary"`
}

type user struct {
	ID        string `gorm:"primary_key" json:"id"`
	Username  string `json:"username"`
	Password  string `json:"password"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Token     string `json:"token"`
}

type App struct {
	db *gorm.DB
	r  *mux.Router
}

func (a *App) start() {

	a.db.AutoMigrate(&event{})
	a.db.AutoMigrate(&user{})

	a.r.HandleFunc("/planner/{id}", a.getUserEvents).Methods("GET")
	a.r.HandleFunc("/planner/{id}", a.addEvent).Methods("POST")
	a.r.HandleFunc("/planner/{id1}/{id2}", a.updateEvent).Methods("PUT")
	a.r.HandleFunc("/planner/{id1}/{id2}", a.deleteEvent).Methods("DELETE")
	a.r.HandleFunc("/users/register", a.registerUser).Methods("POST")
	a.r.HandleFunc("/users/auth", a.authenticateUser).Methods("POST")
	a.r.HandleFunc("/users/{id}", a.registerUser).Methods("DELETE")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:4200", "http://localhost:3000", "http://localhost:*", "http://localhost, http://localhost*"},
		AllowCredentials: true,
		AllowedHeaders:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "UPDATE", "OPTIONS"},
	})

	handler := c.Handler(a.r)
	log.Fatal(http.ListenAndServe(":3000", handler))

	fmt.Println("test9")
}

func (a *App) getUserEvents(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	var all []event

	err := a.db.Where(" user_id = ?", mux.Vars(r)["id"]).Find(&all).Error
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

	//fmt.Println("TESTING")
	w.Header().Set("Content-Type", "application/json")

	var s event

	err := json.NewDecoder(r.Body).Decode(&s)

	if err != nil {
		//fmt.Println("Couldn't decode")
		sendErr(w, http.StatusBadRequest, err.Error())
		return
	}

	s.ID = uuid.New().String()
	s.UserID = mux.Vars(r)["id"]

	if s.UserID == "" || s.Primary == "" || s.Secondary == "" || s.Title == "" || s.Start == "" || s.End == "" {
		//fmt.Println("Couldn't find something")
		//fmt.Println(s)
		sendErr(w, http.StatusInternalServerError, "One or more necessary fields are empty")
		return
	}

	err = a.db.Save(&s).Error
	if err != nil {
		//fmt.Println("Couldn't save")
		sendErr(w, http.StatusInternalServerError, err.Error())
	} else {
		w.WriteHeader(http.StatusCreated)
	}
}

func (a *App) updateEvent(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	var s event
	err := json.NewDecoder(r.Body).Decode(&s)
	if err != nil {
		sendErr(w, http.StatusBadRequest, err.Error())
		return
	}
	s.UserID = mux.Vars(r)["id1"]
	s.ID = mux.Vars(r)["id2"]

	if s.ID == "" || s.UserID == "" || s.Title == "" || s.Start == "" || s.End == "" || s.Primary == "" || s.Secondary == "" {
		sendErr(w, http.StatusBadRequest, "Missing event field")
		return
	}
	err = a.db.Save(&s).Error
	if err != nil {
		sendErr(w, http.StatusInternalServerError, err.Error())
	}
}

func (a *App) deleteEvent(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	var all []event

	err := a.db.Where("id = ?", mux.Vars(r)["id2"], "userID = ?", mux.Vars(r)["id1"]).Delete(&all).Error

	if err != nil {
		sendErr(w, http.StatusInternalServerError, err.Error())
	}
}

func (a *App) registerUser(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	var s user
	err := json.NewDecoder(r.Body).Decode(&s)
	//fmt.Println(s)
	if err != nil {
		sendErr(w, http.StatusBadRequest, err.Error())
		return
	}
	var all []user

	err = a.db.Where(" username = ?", s.Username).Find(&all).Error

	if len(all) != 0 {
		sendErr(w, http.StatusInternalServerError, "Username has been used before")
		return
	}
	s.ID = uuid.New().String()

	if s.FirstName == "" || s.LastName == "" || s.Password == "" || s.Username == "" {

		sendErr(w, http.StatusInternalServerError, "One or more necessary fields are empty")
		return
	}

	err = a.db.Save(&s).Error
	if err != nil {
		sendErr(w, http.StatusInternalServerError, err.Error())
	} else {
		w.WriteHeader(http.StatusCreated)
	}
}

func (a *App) authenticateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var s user
	err := json.NewDecoder(r.Body).Decode(&s)
	if err != nil {
		sendErr(w, http.StatusBadRequest, err.Error())
		return
	}

	var n user
	err = a.db.First(&n, "username = ?", s.Username).Error

	if err == nil && n.Password == s.Password {
		err = json.NewEncoder(w).Encode(n)
		if err != nil {
			sendErr(w, http.StatusInternalServerError, err.Error())
		}
	} else {

		sendErr(w, http.StatusBadRequest, "Incorrect Username or Password")
	}

}

func (a *App) deleteUser(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	var users []user
	var events []event

	err := a.db.Where("id = ?", mux.Vars(r)["id"]).Delete(&users).Error

	if err != nil {
		sendErr(w, http.StatusInternalServerError, err.Error())
	}

	err = a.db.Where("user_id = ?", mux.Vars(r)["id"]).Delete(&events).Error

	if err != nil {
		sendErr(w, http.StatusInternalServerError, err.Error())
	}
}

func sendErr(w http.ResponseWriter, code int, message string) {
	resp, _ := json.Marshal(map[string]string{"error": message})
	http.Error(w, string(resp), code)
}
