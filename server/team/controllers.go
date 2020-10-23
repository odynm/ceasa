package team

import (
	"encoding/json"
	"net/http"

	"ceasa/loader"
	"ceasa/user"
	"ceasa/utils"
)

func getAllLoader(w http.ResponseWriter, r *http.Request) {
	loaderId := loader.CheckLogin(w, r)
	if loaderId > 0 {
		teams, ok := GetAllTeamsFromLoader(loaderId, w)
		if ok {
			utils.Success(w, teams)
		}
	} else {
		utils.NoAuth(w)
	}
}

func getAllVendor(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		teams, ok := GetAllTeamsFromVendor(userId, w)
		if ok {
			utils.Success(w, teams)
		}
	} else {
		utils.NoAuth(w)
	}
}

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
		var joinTeamToken JoinTeamToken
		err := json.NewDecoder(r.Body).Decode(&joinTeamToken)
		if err != nil || joinTeamToken.Token != "" {
			AddToTeam(loaderId, joinTeamToken.Token, w)
		} else {
			utils.Failed(w, -1)
		}
	} else {
		utils.NoAuth(w)
	}
}

func teamLoaderRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		getAllLoader(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func teamVendorRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		getAllVendor(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
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

func teamJoinRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		join(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("/team/vendor", teamVendorRouter)
	http.HandleFunc("/team/loader", teamLoaderRouter)
	http.HandleFunc("/team/code", teamCodeRouter)
	http.HandleFunc("/team/join", teamJoinRouter)
}
