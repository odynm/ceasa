package storage

import (
	"net/http"

	"../utils"
)

func Add(itemDto ItemDto, userId int, w http.ResponseWriter) {
	result := DbCreateStorageItem(itemDto, userId)
	if result == 0 {
		utils.Failed(w, -1)
	} else {
		utils.Success(w, result)
	}
}

func Get(userId int, w http.ResponseWriter) {
	response := DbGetAllFull(userId)
	w.Header().Set("Content-Type", "application/json")
	utils.Success(w, response)
}
