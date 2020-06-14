package client

import (
	"net/http"

	"../utils"
)

func AddOrUpdateClient(clientDto ClientDto, userId int, w http.ResponseWriter) int {
	id := dbCreateOrUpdateClient(clientDto, userId)
	if id == 0 {
		utils.BadRequest(w, "")
	}
	return id
}
