package storage

import (
	"encoding/json"
	"net/http"

	"../user"
	"../utils"
)

func add(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		var itemDto ItemDto
		err := json.NewDecoder(r.Body).Decode(&itemDto)
		if err != nil ||
			itemDto.Product == 0 ||
			itemDto.Amount == 0 {
			utils.Failed(w, -1)
		} else {
			if itemDto.Id == 0 {
				Add(itemDto, userId, w)
			} else {
				Edit(itemDto, userId, w)
			}
		}
	}
}

func get(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		Get(userId, w)
	}
}

func storageRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		add(w, r)
	case http.MethodGet:
		get(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("/storage", storageRouter)
}
