package storage

import (
	"encoding/json"
	"net/http"
)

func Add(itemDto ItemDto, userId int, w http.ResponseWriter) {
	dbCreateStorageItem(itemDto, userId)
}

func Get(userId int, w http.ResponseWriter) {
	response := dbGetStorage(userId)
	w.Header().Set("Content-Type", "application/json")
	js, _ := json.Marshal(response)
	w.Write(js)
}
