package device

import (
	"net/http"

	"ceasa/utils"
)

func CreateDevice(hash string, w http.ResponseWriter) (int, bool) {
	dbId := DbGetDevice(hash)
	if dbId != 0 {
		utils.Failed(w, -1)
		return 0, false
	}

	id := DbCreateDevice(hash)
	if id == 0 {
		utils.Failed(w, -1)
	}
	return id, id > 0
}
