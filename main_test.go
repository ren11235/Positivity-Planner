package main

import (
	"bytes"
	"fmt"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"

	"net/http"

	"testing"

	"net/http/httptest"

	"encoding/json"

	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func TestGetUser(t *testing.T) {
	fmt.Print("1. Testing getting events for test user")
	db, err := gorm.Open("sqlite3", "./planner.db")

	if err != nil {
		panic(err.Error())
	}

	app := App{
		db: db,
		r:  mux.NewRouter(),
	}

	w := httptest.NewRecorder()

	req, err := http.NewRequest("GET", "/planner/f4e37561-3449-4ebc-bebc-f01965a5864c", nil)

	if err != nil {
		t.Errorf("Invalid HTTP request")
		return
	}

	req = mux.SetURLVars(req, map[string]string{"id": "f4e37561-3449-4ebc-bebc-f01965a5864c"})

	app.getUserEvents(w, req)

	if w.Code != 200 {
		t.Errorf("Unsuccessful HTTP request")
		return
	}

	var all_events []event

	err = json.Unmarshal([]byte(w.Body.String()), &all_events)

	if err != nil {
		t.Errorf("Could not parse json into event objects")
		return
	}

	if len(all_events) != 3 {
		t.Errorf("Got incorrect number of events for test user: %d, want: %d.", len(all_events), 3)
		return
	}

	for i := 1; i < len(all_events); i++ {
		curr_event := all_events[i]

		if curr_event.UserID != "f4e37561-3449-4ebc-bebc-f01965a5864c" {
			t.Errorf("Incorrect user id")
			return
		}
		if curr_event.ID == "" {
			t.Errorf("Missing id")
			return
		}
		if curr_event.Primary == "" {
			t.Errorf("Missing primary color")
			return
		}
		if curr_event.Secondary == "" {
			t.Errorf("Missing secondary color")
			return
		}
		if curr_event.Start == "" {
			t.Errorf("Missing start time")
			return
		}
		if curr_event.End == "" {
			t.Errorf("Missing end time")
			return
		}
	}
	fmt.Println("--- PASSED")
}

func TestGetEmptyUser(t *testing.T) {
	fmt.Print("2. Testing getting events for empty user")
	db, err := gorm.Open("sqlite3", "./planner.db")

	if err != nil {
		panic(err.Error())
	}

	app := App{
		db: db,
		r:  mux.NewRouter(),
	}

	w := httptest.NewRecorder()

	req, err := http.NewRequest("GET", "/planner/ ", nil)

	if err != nil {
		t.Errorf("Invalid HTTP request")
		return
	}

	app.getUserEvents(w, req)

	if w.Code != 200 {
		t.Errorf("Unsuccessful HTTP request")
		return
	}

	var all_events []event
	err = json.Unmarshal([]byte(w.Body.String()), &all_events)

	if err != nil {
		t.Errorf("Could not parse json into event objects")
		return
	}

	if len(all_events) != 0 {
		t.Errorf("Got incorrect number of events for test user: %d, want: %d.", len(all_events), 0)
		return
	}
	fmt.Println("--- PASSED")

}

func TestGetIncorrectUser(t *testing.T) {
	fmt.Print("3. Testing getting events for incorrect user")
	db, err := gorm.Open("sqlite3", "./planner.db")

	if err != nil {
		panic(err.Error())
	}

	app := App{
		db: db,
		r:  mux.NewRouter(),
	}

	w := httptest.NewRecorder()

	req, err := http.NewRequest("GET", "/planner/f4e37561-3449-4ebc-bebc-f01965a5864", nil)

	if err != nil {
		t.Errorf("Invalid HTTP request")
		return
	}

	app.getUserEvents(w, req)

	if w.Code != 200 {
		t.Errorf("Unsuccessful HTTP request")
		return
	}

	var all_events []event
	err = json.Unmarshal([]byte(w.Body.String()), &all_events)

	if err != nil {
		t.Errorf("Could not parse json into event objects")
		return
	}

	if len(all_events) != 0 {
		t.Errorf("Got incorrect number of events for test user: %d, want: %d.", len(all_events), 0)
		return
	}
	fmt.Println(" --- PASSED")
}

func TestAddEventTestUser(t *testing.T) {
	fmt.Print("4. Testing adding an event for test user")
	db, err := gorm.Open("sqlite3", "./planner.db")

	if err != nil {
		panic(err.Error())
	}

	app := App{
		db: db,
		r:  mux.NewRouter(),
	}

	var jsonData = []byte(`{
		"id": "3",
		"title": "New Test event",
		"start": "2022-04-20T20:00:00.000Z",
		"end": "2022-04-20T21:00:00.000Z",
		"primary": "#398c15", 
		"secondary": "#95dc77"
	}`)

	w := httptest.NewRecorder()

	req, err := http.NewRequest("POST", "/planner/f4e37561-3449-4ebc-bebc-f01965a5864", bytes.NewReader(jsonData))

	if err != nil {
		t.Errorf("Invalid HTTP request")
		return
	}

	req = mux.SetURLVars(req, map[string]string{"id": "f4e37561-3449-4ebc-bebc-f01965a5864c"})

	app.addEvent(w, req)

	if w.Code != 201 {
		t.Errorf("Unsuccessful HTTP request")
		return
	}
	fmt.Println("--- PASSED")
}

func TestAddEventEmptyUser(t *testing.T) {
	fmt.Print("5. Testing adding an event for empty user")
	db, err := gorm.Open("sqlite3", "./planner.db")

	if err != nil {
		panic(err.Error())
	}

	app := App{
		db: db,
		r:  mux.NewRouter(),
	}

	var jsonData = []byte(`{
		"id": "3",
		"title": "New Test event",
		"start": "2022-04-21T20:00:00.000Z",
		"end": "2022-04-21T21:00:00.000Z",
		"primary": "#398c15", 
		"secondary": "#95dc77"
	}`)

	w := httptest.NewRecorder()

	req, err := http.NewRequest("POST", "/planner/", bytes.NewReader(jsonData))

	if err != nil {
		t.Errorf("Invalid HTTP request")
		return
	}

	app.addEvent(w, req)

	if w.Code == 201 {
		t.Errorf("Allows empty user in HTTP POST request")
		return
	}
	fmt.Println("--- PASSED")

}

func TestAddEventIncorrectUser(t *testing.T) {
	fmt.Print("6. Testing adding an event for incorrect user")
	db, err := gorm.Open("sqlite3", "./planner.db")

	if err != nil {
		panic(err.Error())
	}

	app := App{
		db: db,
		r:  mux.NewRouter(),
	}

	var jsonData = []byte(`{
		"id": "3",
		"title": "New Test event",
		"start": "2022-04-21T20:00:00.000Z",
		"end": "2022-04-21T21:00:00.000Z",
		"primary": "#398c15", 
		"secondary": "#95dc77"
	}`)

	w := httptest.NewRecorder()

	req, err := http.NewRequest("POST", "/planner/f4e37561-3449-4ebc-bebc-f01965a5864", bytes.NewReader(jsonData))

	if err != nil {
		t.Errorf("Invalid HTTP request")
		return
	}

	app.addEvent(w, req)

	if w.Code == 201 {
		t.Errorf("Allows incorrect user in HTTP POST request")
		return
	}
	fmt.Println("--- PASSED")

}

func TestAddEventMissingFields(t *testing.T) {
	fmt.Print("7. Testing adding an event with missing fields for test user")
	db, err := gorm.Open("sqlite3", "./planner.db")

	if err != nil {
		panic(err.Error())
	}

	app := App{
		db: db,
		r:  mux.NewRouter(),
	}

	var jsonData = []byte(`{
		"id": "3",
		"title": "",
		"start": "2022-04-21T20:00:00.000Z",
		"end": "2022-04-21T21:00:00.000Z",
		"primary": "", 
		"secondary": "#95dc77"
	}`)

	w := httptest.NewRecorder()

	req, err := http.NewRequest("POST", "/planner/f4e37561-3449-4ebc-bebc-f01965a5864c", bytes.NewReader(jsonData))

	if err != nil {
		t.Errorf("Invalid HTTP request")
		return
	}

	app.addEvent(w, req)

	if w.Code == 201 {
		t.Errorf("Allows incorrect user in HTTP POST request")
		return
	}

	fmt.Println("--- PASSED")
}
