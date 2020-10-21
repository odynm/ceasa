package home

import (
	"net/http"

	"ceasa/utils"
)

func Get(userId int, w http.ResponseWriter) {
	response := DbGetHomeItems(userId)
	utils.Success(w, response)
}
