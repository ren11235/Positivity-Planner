package planner

import (
	"errors"
	"sync"

	"github.com/rs/xid"
)

var (
	list []Event
	mtx  sync.RWMutex
	once sync.Once
)

func init() {
	once.Do(initialiseList)
}

func initialiseList() {
	list = []Event{}
}

// Planner data structure
type Event struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Time string `json:"time"`
}

// Get retrieves all events
func Get() []Event {
	return list
}

// Adds a new event
func Add(message string, time string) string {
	t := newEvent(message, time)
	mtx.Lock()
	list = append(list, t)
	mtx.Unlock()
	return t.ID
}

// Removes an event
func Delete(id string) error {
	location, err := findEventLocation(id)
	if err != nil {
		return err
	}
	removeElementByLocation(location)
	return nil
}

func newEvent(msg string, time string) Event {
	return Event{
		ID:   xid.New().String(),
		Name: msg,
		Time: time,
	}
}

func findEventLocation(id string) (int, error) {
	mtx.RLock()
	defer mtx.RUnlock()
	for i, t := range list {
		if isMatchingID(t.ID, id) {
			return i, nil
		}
	}
	return 0, errors.New("could not find event based on id")
}

func removeElementByLocation(i int) {
	mtx.Lock()
	list = append(list[:i], list[i+1:]...)
	mtx.Unlock()
}

func isMatchingID(a string, b string) bool {
	return a == b
}
