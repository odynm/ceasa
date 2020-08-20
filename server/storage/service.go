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
	utils.Success(w, response)
}
