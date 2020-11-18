package client

import (
	"net/http"

	"ceasa/utils"
)

func GetClients(userId int, w http.ResponseWriter) ([]ClientDto, bool) {
	clients, ok := DbGetClients(userId)
	return clients, ok
}

func AddOrUpdateClient(clientDto ClientDto, userId int, w http.ResponseWriter) int {
	id := DbCreateOrUpdateClient(clientDto, userId)
	if id == 0 {
		utils.Failed(w, -1)
	}
	return id
}
