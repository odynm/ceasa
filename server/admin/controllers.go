package admin

import (
	"encoding/json"
	"fmt"
	"net/http"

	"../utils"
)

func post(w http.ResponseWriter, r *http.Request) {
	var adminLogin AdminLoginDto
	err := json.NewDecoder(r.Body).Decode(&adminLogin)
	if err != nil {
		utils.BadRequest(w, "")
		return
	}

	CreateAdmin(adminLogin, w)
}

func login(w http.ResponseWriter, r *http.Request) {
	var adminLogin AdminLoginDto
	err := json.NewDecoder(r.Body).Decode(&adminLogin)
	if err != nil {
		utils.BadRequest(w, "")
		return
	}

	LoginAdmin(adminLogin, w)
}

func adminRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		fmt.Fprintf(w, "Welcome to the AdminPage GET")
	case http.MethodPost:
		// TODO this should be commented on production
		post(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func loginRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		login(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("/admin", adminRouter)
	http.HandleFunc("/login-admin", loginRouter)
}
