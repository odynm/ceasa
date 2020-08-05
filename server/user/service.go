package user

import (
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"../utils"
)

type AuthData struct {
	token        string
	loaderToken  string
	creationDate time.Time
}

var tokens = map[int]AuthData{}

func CreateUser(userDto UserDto, w http.ResponseWriter) {
	id := DbGetId(userDto.Login)
	if id == 0 {
		login := strings.ToUpper(userDto.Login)
		hash := utils.GetHash(login + "@" + userDto.Pass)
		permissions := int(1) // Padrão vendedor
		DbCreateUser(login, hash, permissions)
	} else {
		utils.InsertError(w, "User já existente")
	}
}

func LoginUser(userLogin UserDto, w http.ResponseWriter) {
	login := strings.ToUpper(userLogin.Login)
	hash := utils.GetHash(login + "@" + userLogin.Pass)
	dbUser := DbGetByLogin(login)
	if dbUser.Hash == hash {
		token := utils.GetHash(login + "17" + hash + "F" + time.Now().String())
		tokens[dbUser.Id] = AuthData{
			token:        token,
			loaderToken:  utils.GetHash("L" + time.Now().String()),
			creationDate: time.Now(),
		}
		response := UserResponse{
			Id:    dbUser.Id,
			Token: token,
		}
		w.Header().Set("Content-Type", "application/json")
		utils.Success(w, response)
	} else {
		utils.Failed(w, -1)
	}
}

func RefreshTokenUser(refresh UserDto, w http.ResponseWriter) {
	// dbUser := DbGetRefresh(refresh.Token)
	// if dbUser.RefreshToken == refresh.Token {
	// 	token := utils.GetHash(adminLogin.Login + "17" + hash + "F" + time.Now().String())
	// 	tokens[dbUser.Id] = AuthData{
	// 		token:        token,
	// 		loaderToken:  utils.GetHash("L" + time.Now().String()),
	// 		creationDate: time.Now(),
	// 	}
	// 	response := UserResponse{
	// 		Id:    dbUser.Id,
	// 		Token: token,
	// 	}
	// 	w.Header().Set("Content-Type", "application/json")
	// 	js, _ := json.Marshal(response)
	// 	w.Write(js)
	// } else {
	// 	utils.NoAuth(w)
	// }
}

func IsLogged(id int, auth string, w http.ResponseWriter) bool {
	if len(auth) == 0 || id == 0 || tokens[id].token != auth {
		utils.NoAuth(w)
		return false
	} else {
		today := time.Now()
		if tokens[id].creationDate.Year() != today.Year() ||
			tokens[id].creationDate.YearDay() != today.YearDay() {
			w.Header().Set("Content-Type", "application/json")
			utils.NoAuth(w)
			io.WriteString(w, "{ \"refresh\":\"true\"}")
			return false
		} else {
			return true
		}
	}
}

func CheckLogin(w http.ResponseWriter, r *http.Request) int {
	userStr := r.Header.Get("User")
	userId, err := strconv.ParseInt(userStr, 10, 32)
	auth := r.Header.Get("Auth")
	if err != nil || len(auth) == 0 || userId == 0 || tokens[int(userId)].token != auth {
		utils.NoAuth(w)
		return 0
	} else {
		return int(userId)
	}
}
