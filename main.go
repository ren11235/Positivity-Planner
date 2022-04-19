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

//type Color struct {
//Primary   string `json:"primary"`
//Secondary string `json:"secondary"`
//}

type event struct {
	ID        string `gorm:"primary_key" json:"id"`
	UserID    string `json:"userID"`
	Title     string `json:"title"`
	Start     string `json:"start"`
	End       string `json:"end"`
	Primary   string `json:"primary"`
	Secondary string `json:"secondary"`
	//Color struct {
	//Primary   string `json:"primary"`
	//Secondary string `json:"secondary"`
	//} `json:"color"`
	//Color  Color  `json:"color"`
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
	fmt.Println("test6")

	a.db.AutoMigrate(&event{})
	a.db.AutoMigrate(&user{})
	//a.db.AutoMigrate(&Color{})
	fmt.Println("test7")
	//a.r.HandleFunc("/planner", a.getAllEvents).Methods("GET")
	a.r.HandleFunc("/planner/{id}", a.getUserEvents).Methods("GET")
	a.r.HandleFunc("/planner/{id}", a.addEvent).Methods("POST")
	//a.r.HandleFunc("/planner/{id}", a.updateEvent).Methods("PUT")
	a.r.HandleFunc("/planner/{id1}/{id2}", a.deleteEvent).Methods("DELETE")
	a.r.HandleFunc("/users/register", a.registerUser).Methods("POST")
	a.r.HandleFunc("/users/auth", a.authenticateUser).Methods("POST")

	fmt.Println("test8")
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:4200", "http://localhost:3000", "http://localhost:*", "http://localhost, http://localhost*"},
		AllowCredentials: true,
		AllowedHeaders:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "DELETE", "UPDATE", "OPTIONS"},
	})

	handler := c.Handler(a.r)
	log.Fatal(http.ListenAndServe(":3000", handler))
	//log.Fatal(http.ListenAndServe(":3000", a.r))
	fmt.Println("test9")
}

func (a *App) getUserEvents(w http.ResponseWriter, r *http.Request) {

	fmt.Println("Getting User Events")
	//var s user
	//err := json.NewDecoder(r.Body).Decode(&s)
	//fmt.Println(s)
	//if err != nil {
	//sendErr(w, http.StatusBadRequest, err.Error())
	//return
	//}
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
	fmt.Println("Adding Event")
	w.Header().Set("Content-Type", "application/json")
	fmt.Println(r.Body)

	//s := &event{}
	var s event
	//err := json.Unmarshal([]byte(r.Body), s)

	err := json.NewDecoder(r.Body).Decode(&s)
	if err != nil {
		sendErr(w, http.StatusBadRequest, err.Error())
		return
	}

	s.ID = uuid.New().String()
	s.UserID = mux.Vars(r)["id"]

	fmt.Println(s.ID)
	fmt.Println(s.UserID)
	err = a.db.Save(&s).Error
	if err != nil {
		sendErr(w, http.StatusInternalServerError, err.Error())
	} else {
		fmt.Println("SUCCESSFULLY ADDED")
		w.WriteHeader(http.StatusCreated)
	}
}

func (a *App) registerUser(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	var s user
	err := json.NewDecoder(r.Body).Decode(&s)
	fmt.Println(s)
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

func (a *App) testAuthenticateUser(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	var s user
	err := json.NewDecoder(r.Body).Decode(&s)

	fmt.Println(s)
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

func (a *App) authenticateUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("********* Authenticating User ***********")
	w.Header().Set("Content-Type", "application/json")

	var s user
	err := json.NewDecoder(r.Body).Decode(&s)
	fmt.Println(s)
	if err != nil {
		sendErr(w, http.StatusBadRequest, err.Error())
		return
	}

	var n user
	err = a.db.First(&n, "username = ?", s.Username).Error // find product with code D42

	if err == nil && n.Password == s.Password {
		err = json.NewEncoder(w).Encode(n)
		if err != nil {

			sendErr(w, http.StatusInternalServerError, err.Error())
		}
	} else {

		sendErr(w, http.StatusBadRequest, "Incorrect Username or Password")
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
	var all []event

	//fmt.Println("Event ID: " + mux.Vars(r)["id2"])
	//fmt.Println("User ID: " + mux.Vars(r)["id1"])

	err := a.db.Where("id = ?", mux.Vars(r)["id2"], "userID = ?", mux.Vars(r)["id1"]).Delete(&all).Error
	//err := a.db.Where(map[string]interface{}{"id": mux.Vars(r)["id2"], "userID": mux.Vars(r)["id1"]}).Delete(&all).Error
	//err := a.db.Unscoped().Delete(event{ID: mux.Vars(r)["id2"], userID: mux.Vars(r)["id1"]}).Error
	if err != nil {
		fmt.Println("Error deleting event")
		sendErr(w, http.StatusInternalServerError, err.Error())
	}
}

func sendErr(w http.ResponseWriter, code int, message string) {
	resp, _ := json.Marshal(map[string]string{"error": message})
	http.Error(w, string(resp), code)
}
