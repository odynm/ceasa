package team

import (
	"net/http"
	"time"

	"../user"
	"../utils"
)

func getCode(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		auth, ok := user.GetUserIdAuthData(userId, w)
		if ok {
			joinTeamToken := JoinTeamToken {
				Token: auth.LoaderToken + time.Now().String()
			}
			utils.Success(w, joinTeamToken)
		}
	} else {
		utils.NoAuth(w)
	}
}

func create(w http.ResponseWriter, r *http.Request) {
	// sent by the loader with the target user team code
}

func teamCodeRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		getCode(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func teamRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		create(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("team/code", teamCodeRouter)
	http.HandleFunc("team/create", teamRouter)
}
