package home

import (
	"net/http"

	"ceasa/user"
	"ceasa/utils"
)

func get(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		timezone := r.Header.Get("Timezone")
		if len(timezone) > 0 {
			Get(userId, timezone, w)
		} else {
			utils.Failed(w, -1)
		}
	} else {
		utils.NoAuth(w)
	}
}

func homeRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		get(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("/home", homeRouter)
}
