package client

import (
	"net/http"

	"ceasa/utils"
)

func AddOrUpdateClient(clientDto ClientDto, userId int, w http.ResponseWriter) int {
	id := DbCreateOrUpdateClient(clientDto, userId)
	if id == 0 {
		utils.BadRequest(w, "")
	}
	return id
}
