package main

import (
	"path"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/ren11235/Positivity-Planner/handlers"
)

func main() {
	r := gin.Default()
	r.NoRoute(func(c *gin.Context) {
		dir, file := path.Split(c.Request.RequestURI)
		ext := filepath.Ext(file)
		if file == "" || ext == "" {
			c.File("./ui/dist/ui/index.html")
		} else {
			c.File("./ui/dist/ui/" + path.Join(dir, file))
		}
	})

	r.GET("/planner", handlers.GetEventListHandler)
	r.POST("/planner", handlers.AddEventHandler)
	r.DELETE("/planner/:id", handlers.DeleteEventHandler)

	err := r.Run(":3000")
	if err != nil {
		panic(err)
	}
}
