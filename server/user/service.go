package user

import (
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"ceasa/utils"
)

type AuthData struct {
	Token        string
	LoaderToken  string
	CreationDate time.Time
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
			Token:        token,
			LoaderToken:  utils.GetHash("L" + time.Now().String()),
			CreationDate: time.Now(),
		}
		response := UserResponse{
			Id:    dbUser.Id,
			Token: token,
		}
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
	//
	// 	js, _ := json.Marshal(response)
	// 	w.Write(js)
	// } else {
	// 	utils.NoAuth(w)
	// }
}

func IsLogged(id int, auth string, w http.ResponseWriter) bool {
	if len(auth) == 0 || id == 0 || tokens[id].Token != auth {
		utils.NoAuth(w)
		return false
	} else {
		today := time.Now()
		if tokens[id].CreationDate.Year() != today.Year() ||
			tokens[id].CreationDate.YearDay() != today.YearDay() {
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
	if err != nil || len(auth) == 0 || userId == 0 || tokens[int(userId)].Token != auth {
		utils.NoAuth(w)
		return 0
	} else {
		return int(userId)
	}
}

func GetUserIdAuthData(userId int, w http.ResponseWriter) (AuthData, bool) {
	authData := tokens[userId]
	return authData, true
}

func GetUserFromLoaderToken(loaderToken string) (int, bool) {
	for key, token := range tokens {
		if token.LoaderToken == loaderToken {
			return key, true
		}
	}
	return 0, false
}
