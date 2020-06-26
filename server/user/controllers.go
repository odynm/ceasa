package user

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"

	"../admin"
	"../utils"
)

func login(w http.ResponseWriter, r *http.Request) {
	var userDto UserDto
	err := json.NewDecoder(r.Body).Decode(&userDto)
	if err != nil || userDto.Login == "" {
		utils.NoAuth(w)
	}
	LoginUser(userDto, w)
}

func refresh(w http.ResponseWriter, r *http.Request) {
	var userDto UserDto
	err := json.NewDecoder(r.Body).Decode(&userDto)
	if err != nil || userDto.Login == "" {
		utils.NoAuth(w)
	}
	RefreshTokenUser(userDto, w)
}

func post(w http.ResponseWriter, r *http.Request) {
	var userDto UserDto
	err := json.NewDecoder(r.Body).Decode(&userDto)
	auth := r.Header.Get("Auth")
	if err != nil {
		utils.NoAuth(w)
	}
	ok := admin.IsAdminLogged(auth, w)
	if ok {
		CreateUser(userDto, w)
	}
}

func test(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.ParseInt(r.Header.Get("User"), 10, 32)
	auth := r.Header.Get("Auth")
	ok := IsLogged(int(id), auth, w)
	if ok {
		io.WriteString(w, "ok")
	}
}

func userRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		post(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func loginRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		login(w, r)
	case http.MethodGet:
		test(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func refreshRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		refresh(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("/user", userRouter)
	http.HandleFunc("/login", loginRouter)
	http.HandleFunc("/refresh", refreshRouter)
}
