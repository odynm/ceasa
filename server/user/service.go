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
	RefreshToken string
	ParentUser   int
}

var tokens = map[int]AuthData{}

func CreateUser(userDto UserDto, w http.ResponseWriter) {
	login := strings.ToUpper(userDto.Login)
	id := DbGetId(login)
	if id == 0 {
		hash := utils.GetHash(login + "@" + userDto.Pass)
		permissions := int(1) // Padrão vendedor
		DbCreateUser(login, hash, userDto.ParentUser, permissions)
	} else {
		utils.InsertError(w, "User já existente")
	}
}

func LoginUser(userLogin UserDto, w http.ResponseWriter) {
	login := strings.ToUpper(userLogin.Login)
	hash := utils.GetHash(login + "@" + userLogin.Pass)
	dbUser := DbGetByLogin(login)

	if dbUser.Hash == hash {
		refreshToken := utils.GetHash(login + "RR" + hash + "Fresh" + time.Now().UTC().String())
		DbSetLogin(dbUser.Id, refreshToken)
		token := utils.GetHash(login + "17" + hash + "F" + time.Now().UTC().String())
		// Big note: REFRESH TOKEN is not being used right now

		var parentUser int
		if dbUser.ParentUser.Valid {
			parentUser = int(dbUser.ParentUser.Int32)
		} else {
			parentUser = 0
		}

		// Shorten it up to be easier to write
		loaderToken :=  strings.ToUpper(utils.GetHash("L" + time.Now().UTC().String())[0:5])

		tokens[dbUser.Id] = AuthData{
			Token:        token,
			LoaderToken:  loaderToken,
			CreationDate: time.Now().UTC(),
			RefreshToken: refreshToken,
			ParentUser:   parentUser,
		}
		response := UserResponse{
			Id:           dbUser.Id,
			Token:        token,
			RefreshToken: refreshToken,
			ParentUser:   parentUser,
		}
		utils.Success(w, response)
	} else {
		utils.Failed(w, -1)
	}
}

func RefreshTokenUser(refresh UserDto, w http.ResponseWriter) {
	// dbUser := DbGetRefresh(refresh.Token)
	// if dbUser.RefreshToken == refresh.Token {
	// 	token := utils.GetHash(adminLogin.Login + "17" + hash + "F" + time.Now().UTC().String())
	// 	tokens[dbUser.Id] = AuthData{
	// 		token:        token,
	// 		loaderToken:  utils.GetHash("L" + time.Now().UTC().String()),
	// 		creationDate: time.Now().UTC(),
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
		today := time.Now().UTC()
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
	// ChildUsers are users that doesn't have storage, but use someone else's one
	// If there's no child element, it is a main user
	// Those are used for login then, but the User is always the returned one
	// to ensure correct access to storage

	var userToLoginId int

	childUserStr := r.Header.Get("ChildUser")
	userStr := r.Header.Get("User")
	auth := r.Header.Get("Auth")
	userId, err := strconv.ParseInt(userStr, 10, 32)

	if err != nil {
		goto Error
	}

	if len(childUserStr) > 0 {
		childUserId, err2 := strconv.ParseInt(childUserStr, 10, 32)
		userToLoginId = int(childUserId)
		if err2 != nil || tokens[userToLoginId].ParentUser != int(userId) {
			// Check if error and if this user has access to this storage (parentUser)
			goto Error
		}
	} else {
		userToLoginId = int(userId)
	}
	if len(auth) > 0 && userToLoginId > 0 && tokens[userToLoginId].Token == auth {
		return int(userId) // Always return userId, because that's the user's storage
	} else {
		goto Error
	}

Error:
	utils.NoAuth(w)
	return 0
}

func GetUserIdAuthData(userId int, w http.ResponseWriter) (AuthData, bool) {
	authData := tokens[userId]
	return authData, true
}
