package device

import (
	"net/http"

	"../utils"
)

func CreateDevice(hash string, w http.ResponseWriter) (int, bool) {
	id := DbCreateDevice(hash)
	if id == 0 {
		utils.Failed(w, -1)
	}
	return id, id > 0
}
