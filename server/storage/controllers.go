package storage

import (
	"encoding/json"
	"net/http"
	"strconv"

	"ceasa/user"
	"ceasa/utils"
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
	} else {
		utils.NoAuth(w)
	}
}

func get(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		Get(userId, w)
	} else {
		utils.NoAuth(w)
	}
}

func delete(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		storageStr, ok := r.URL.Query()["id"]
		if ok {
			storageId, err := strconv.ParseInt(storageStr[0], 10, 32)
			if err != nil || storageId == 0 {
				utils.Failed(w, -1)
			} else {
				DeleteStorage(userId, int(storageId), w)
				utils.Success(w, storageId)
			}
		} else {
			utils.Failed(w, -1)
		}
	} else {
		utils.NoAuth(w)
	}
}

func reset(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		Reset(userId, w)
	} else {
		utils.NoAuth(w)
	}
}

func storageRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		add(w, r)
	case http.MethodGet:
		get(w, r)
	case http.MethodDelete:
		delete(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func storageResetRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		reset(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("/storage", storageRouter)
	http.HandleFunc("/storage/reset", storageResetRouter)
}
