package admin

import (
	"encoding/json"
	"net/http"

	"ceasa/utils"
)

func post(w http.ResponseWriter, r *http.Request) {
	var adminLogin AdminLoginDto
	err := json.NewDecoder(r.Body).Decode(&adminLogin)
	if err != nil {
		utils.BadRequest(w, "")
		return
	}
	if len(adminLogin.Pass) < 1 {
		utils.Failed(w, -1)
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
	if len(adminLogin.Pass) < 1 {
		utils.Failed(w, -1)
		return
	}

	LoginAdmin(adminLogin, w)
}

func getUsers(w http.ResponseWriter, r *http.Request) {
	adminId := CheckAdminLogin(w, r)
	if adminId > 0 {
		timezone := r.Header.Get("Timezone")
		if len(timezone) > 0 {
			GetUsers(w, timezone)
		} else {
			utils.Failed(w, -1)
		}
	} else {
		utils.NoAuth(w)
	}
}

func doPayment(w http.ResponseWriter, r *http.Request) {
	// We just say "he paid"
	// and then set each month as paid in succession

	// THE FIRST payment will always be the month before the payment day (usually at day 10)
	// So for example Mar 25 and Apr 2 will both set april as "paid"

	adminId := CheckAdminLogin(w, r)
	if adminId > 0 {
		var paymentDto UserIdInfoDTO
		err := json.NewDecoder(r.Body).Decode(&paymentDto)
		if err != nil {
			utils.Failed(w, -1)
			return
		}

		timezone := r.Header.Get("Timezone")
		if len(timezone) > 0 {
			DoNextPayment(w, timezone, adminId, paymentDto)
		} else {
			utils.Failed(w, -1)
		}
	} else {
		utils.NoAuth(w)
	}
}

func changePassword(w http.ResponseWriter, r *http.Request) {
	adminId := CheckAdminLogin(w, r)
	if adminId > 0 {
		var changePasswordDto ChangePasswordDTO
		err := json.NewDecoder(r.Body).Decode(&changePasswordDto)
		if err != nil {
			utils.Failed(w, -1)
			return
		}

		ChangePassword(w, adminId, changePasswordDto)
	} else {
		utils.NoAuth(w)
	}
}

func blockUser(w http.ResponseWriter, r *http.Request) {
	adminId := CheckAdminLogin(w, r)
	if adminId > 0 {
		var userIdInfo UserIdInfoDTO
		err := json.NewDecoder(r.Body).Decode(&userIdInfo)
		if err != nil {
			utils.Failed(w, -1)
			return
		}

		BlockUser(w, adminId, userIdInfo)
	} else {
		utils.NoAuth(w)
	}
}

func deleteUser(w http.ResponseWriter, r *http.Request) {
	adminId := CheckAdminLogin(w, r)
	if adminId > 0 {
		var userIdInfo UserIdInfoDTO
		err := json.NewDecoder(r.Body).Decode(&userIdInfo)
		if err != nil {
			utils.Failed(w, -1)
			return
		}

		DeleteUser(w, adminId, userIdInfo)
	} else {
		utils.NoAuth(w)
	}
}

func adminRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		// TODO this should be commented on production
		// post(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func loginRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		utils.AllowCors(w, r)
		login(w, r)
	case http.MethodOptions:
		utils.AllowCors(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func usersRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		utils.AllowCors(w, r)
		getUsers(w, r)
	case http.MethodOptions:
		utils.AllowCors(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func paymentRoute(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		utils.AllowCors(w, r)
		doPayment(w, r)
	case http.MethodOptions:
		utils.AllowCors(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func changePasswordRoute(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		utils.AllowCors(w, r)
		changePassword(w, r)
	case http.MethodOptions:
		utils.AllowCors(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func blockUserRoute(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		utils.AllowCors(w, r)
		blockUser(w, r)
	case http.MethodOptions:
		utils.AllowCors(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func deleteUserRoute(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		utils.AllowCors(w, r)
		deleteUser(w, r)
	case http.MethodOptions:
		utils.AllowCors(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("/admin", adminRouter)
	http.HandleFunc("/login-admin", loginRouter)
	http.HandleFunc("/admin/users", usersRouter)
	http.HandleFunc("/admin/changePassword", changePasswordRoute)
	http.HandleFunc("/admin/blockUser", blockUserRoute)
	http.HandleFunc("/admin/deleteUser", deleteUserRoute)
}
