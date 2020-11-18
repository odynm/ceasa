package client

import (
	"net/http"

	"ceasa/user"
	"ceasa/utils"
)

func getClients(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		clients, ok := GetClients(userId, w)
		if ok {
			utils.Success(w, clients)
		} else {
			utils.Failed(w, -1)
		}
	} else {
		utils.NoAuth(w)
	}
}

func clientsRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		getClients(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("/clients", clientsRouter)
}
