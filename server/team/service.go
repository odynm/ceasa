package team

import (
	"net/http"

	"ceasa/user"
	"ceasa/utils"
)

func GetAllTeamsFromLoader(loaderId int, w http.ResponseWriter) ([]TeamFull, bool) {
	teams, ok := DbGetAllTeams(loaderId, "loader_id")
	if !ok {
		utils.Failed(w, -1)
	}
	return teams, ok
}

func GetAllTeamsFromVendor(userId int, w http.ResponseWriter) ([]TeamFull, bool) {
	teams, ok := DbGetAllTeams(userId, "user_id")
	if !ok {
		utils.Failed(w, -1)
	}
	return teams, ok
}

func AddToTeam(loaderId int, token string, w http.ResponseWriter) {
	userId, success := user.GetUserFromLoaderToken(token)

	if !success {
		utils.Failed(w, -1)
		return
	}

	teamId := DbGetTeam(loaderId, userId)
	if teamId > 0 {
		utils.Failed(w, -1)
		return
	}

	authData, ok := user.GetUserIdAuthData(userId, w)
	if ok {
		if authData.LoaderToken == token {
			id := DbCreateTeam(loaderId, userId)
			if id > 0 {
				utils.Success(w, id)
			} else {
				utils.Failed(w, -1)
			}
		} else {
			utils.Failed(w, -1)
		}
	} else {
		utils.Failed(w, -1)
	}
}
