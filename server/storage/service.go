package storage

import (
	"net/http"

	"ceasa/utils"
)

func Add(itemDto ItemDto, userId int, w http.ResponseWriter) {
	result := DbCreateStorageItem(itemDto, userId)
	if result == 0 {
		utils.Failed(w, -1)
	} else {
		utils.Success(w, result)
	}
}

func Edit(itemDto ItemDto, userId int, w http.ResponseWriter) {
	result := DbUpdateStorageItem(itemDto, userId)
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

func DeleteStorage(userId int, storageId int, w http.ResponseWriter) {
	ok := DbDeleteStorage(userId, storageId)
	if !ok {
		utils.Failed(w, -1)
	}
}

func Reset(userId int, w http.ResponseWriter) {
	ok := DbResetStorage(userId)
	if !ok {
		utils.Failed(w, -1)
	}
}
