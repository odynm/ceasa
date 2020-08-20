package team

import (
	"encoding/json"
	"net/http"

	"../loader"
	"../user"
	"../utils"
)

func getCode(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		auth, ok := user.GetUserIdAuthData(userId, w)
		if ok {
			joinTeamToken := JoinTeamToken{
				Token: auth.LoaderToken,
			}
			utils.Success(w, joinTeamToken)
		}
	} else {
		utils.NoAuth(w)
	}
}

func join(w http.ResponseWriter, r *http.Request) {
	loaderId := loader.CheckLogin(w, r)
	if loaderId > 0 {
		userId := loader.GetLoaderUserId(w, r)
		if userId > 0 {
			var joinTeamToken JoinTeamToken
			err := json.NewDecoder(r.Body).Decode(&joinTeamToken)
			if err != nil || joinTeamToken.Token != "" {
				AddToTeam(loaderId, userId, joinTeamToken.Token, w)
			} else {
				utils.Failed(w, -1)
			}
		} else {
			utils.NoAuth(w)
		}
	} else {
		utils.NoAuth(w)
	}
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
		join(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("/team/code", teamCodeRouter)
	http.HandleFunc("/team/join", teamRouter)
}
