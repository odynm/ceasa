package user

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"

	"ceasa/admin"
	"ceasa/utils"
)

func login(w http.ResponseWriter, r *http.Request) {
	var userDto UserDto
	err := json.NewDecoder(r.Body).Decode(&userDto)
	if err != nil || userDto.Login == "" || len(userDto.Pass) < 1 {
		utils.NoAuth(w)
	} else {
		LoginUser(userDto, w)
	}
}

func refresh(w http.ResponseWriter, r *http.Request) {
	var userDto UserDto
	err := json.NewDecoder(r.Body).Decode(&userDto)
	if err != nil || userDto.Login == "" {
		utils.NoAuth(w)
	} else {
		RefreshTokenUser(userDto, w)
	}
}

func post(w http.ResponseWriter, r *http.Request) {
	var userDto UserDto
	err := json.NewDecoder(r.Body).Decode(&userDto)
	if err != nil || len(userDto.Pass) < 1 {
		utils.Failed(w, -1)
		return
	} else {
		adminId := admin.CheckAdminLogin(w, r)
		if adminId > 0 {
			CreateUser(w, userDto, adminId)
		} else {
			utils.NoAuth(w)
		}
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
	case http.MethodOptions:
		utils.AllowCors(w, r)
	case http.MethodPost:
		utils.AllowCors(w, r)
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
