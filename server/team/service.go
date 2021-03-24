package team

import (
	"net/http"
	"strconv"
	"strings"

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
	userIdStr := token[0 : len(token)-5]
	securityToken := token[len(token)-5:]

	userId64, err := strconv.ParseInt(userIdStr, 10, 32)
	userId := int(userId64)

	if err != nil {
		userAuthData, success := user.GetUserIdAuthData(userId, w)

		if success {
			teamId := DbGetTeam(loaderId, userId)
			if teamId > 0 {
				if userAuthData.LoaderToken == strings.ToUpper(securityToken) {
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
		} else {
			utils.Failed(w, -1)
		}
	} else {
		utils.Failed(w, -1)
	}
}

func DeleteTeam(teamId int, w http.ResponseWriter) bool {
	ok := DbDeleteTeam(teamId)
	return ok
}
