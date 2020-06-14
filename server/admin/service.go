package admin

import (
	"io"
	"net/http"
	"time"

	"../utils"
)

var tokens = map[string]bool{}

func CreateAdmin(adminLogin AdminLoginDto, w http.ResponseWriter) {
	id := DbGetId(adminLogin.Login)
	if id == 0 {
		hash := utils.GetHash(adminLogin.Login + "@" + adminLogin.Pass)
		DbCreateAdmin(adminLogin.Login, hash)
	} else {
		utils.InsertError(w, "Admin já existente")
	}
}

func LoginAdmin(adminLogin AdminLoginDto, w http.ResponseWriter) {
	hash := utils.GetHash(adminLogin.Login + "@" + adminLogin.Pass)
	adminDb := DbGetByLogin(adminLogin.Login)
	if adminDb.Hash == hash {
		token := utils.GetHash(adminLogin.Login + "15" + hash + "R" + time.Now().String())
		tokens[token] = true
		io.WriteString(w, token)
	} else {
		utils.NoAuth(w)
	}
}

func IsAdminLogged(auth string, w http.ResponseWriter) bool {
	if tokens[auth] {
		return true
	} else {
		utils.NoAuth(w)
		return false
	}
}
