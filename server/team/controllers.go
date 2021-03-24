package team

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

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
			userIdStr := fmt.Sprintf("%05d", userId)
			joinTeamToken := JoinTeamToken{
				Token: userIdStr + auth.LoaderToken,
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

func delete(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		teamIdStr, ok := r.URL.Query()["id"]
		if ok {
			teamId, err := strconv.ParseInt(teamIdStr[0], 10, 32)
			if err != nil || teamId != 0 {
				DeleteTeam(int(teamId), w)
				utils.Success(w, nil)
			} else {
				utils.Failed(w, -1)
			}
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

func teamDeleteRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodDelete:
		delete(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("/team/vendor", teamVendorRouter)
	http.HandleFunc("/team/loader", teamLoaderRouter)
	http.HandleFunc("/team/code", teamCodeRouter)
	http.HandleFunc("/team/join", teamJoinRouter)
	http.HandleFunc("/team/delete", teamDeleteRouter)
}
