package handlers

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ren11235/Positivity-Planner/planner"
)

// Returns all current event items
func GetEventListHandler(c *gin.Context) {
	c.JSON(http.StatusOK, planner.Get())
}

// Adds a new event to the event list
func AddEventHandler(c *gin.Context) {
	eventItem, statusCode, err := convertHTTPBodyToEvent(c.Request.Body)
	if err != nil {
		c.JSON(statusCode, err)
		return
	}
	c.JSON(statusCode, gin.H{"id": planner.Add(eventItem.Name, eventItem.Time)})
}

// Deletes a specified event based on user http input
func DeleteEventHandler(c *gin.Context) {
	eventID := c.Param("id")
	if err := planner.Delete(eventID); err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, "")
}

func convertHTTPBodyToEvent(httpBody io.ReadCloser) (planner.Event, int, error) {
	body, err := ioutil.ReadAll(httpBody)
	if err != nil {
		return planner.Event{}, http.StatusInternalServerError, err
	}
	defer httpBody.Close()
	return convertJSONBodyToEvent(body)
}

func convertJSONBodyToEvent(jsonBody []byte) (planner.Event, int, error) {
	var eventItem planner.Event
	err := json.Unmarshal(jsonBody, &eventItem)
	if err != nil {
		return planner.Event{}, http.StatusBadRequest, err
	}
	return eventItem, http.StatusOK, nil
}
