package admin

import (
	"encoding/json"
	"fmt"
	"net/http"

	"../utils"
)

func post(w http.ResponseWriter, r *http.Request) {
	var adminLogin AdminLogin
	err := json.NewDecoder(r.Body).Decode(&adminLogin)
	if err != nil {
		fmt.Fprintf(w, "")
	}
	id := dbGetId(adminLogin.Login)
	if id == 0 {
		hash := utils.GetHash(adminLogin.Login + "@" + adminLogin.Pass)
		dbCreateAdmin(adminLogin.Login, hash)
	} else {
		utils.InsertError(w, "Admin já existente")
	}
}

func login(w http.ResponseWriter, r *http.Request) {
	var adminLogin AdminLogin
	err := json.NewDecoder(r.Body).Decode(&adminLogin)
	if err != nil {
		fmt.Fprintf(w, "")
	}
	hash := utils.GetHash(adminLogin.Login + "@" + adminLogin.Pass)
	dbCheckLogin(hash)
}

func adminPage(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		fmt.Fprintf(w, "Welcome to the AdminPage GET")
	case http.MethodPost:
		post(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func loginPage(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		login(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("/admin", adminPage)
	http.HandleFunc("/login-admin", loginPage)
}
