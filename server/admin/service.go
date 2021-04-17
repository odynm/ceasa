package admin

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"ceasa/utils"
)

const PAYMENT_DAY = 10

var tokens = map[string]int{}

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
		token := utils.GetHash(adminLogin.Login + "15" + hash + "R" + time.Now().UTC().String())
		tokens[token] = adminDb.Id
		loginReturn := LoginReturn{
			Hash: token,
		}
		utils.Success(w, loginReturn)
	} else {
		utils.NoAuth(w)
	}
}

func GetUsers(w http.ResponseWriter, timezone string) {
	usersList := DbGetUsers(timezone)

	utils.Success(w, usersList)
}

func DoNextPayment(w http.ResponseWriter, timezone string, adminId int, paymentDto UserIdInfoDTO) {
	lastPayment := DbGetLastPayment(paymentDto.UserId)

	if lastPayment.Id > 0 {
		paymentDate := lastPayment.DateDue.AddDate(0, 1, 0)

		dateStr := strconv.Itoa(paymentDate.Year()) + "-" + strconv.Itoa(int(paymentDate.Month())) + "-" + strconv.Itoa(paymentDate.Day())
		DbAddPayment(adminId, paymentDto.UserId, dateStr)
	} else {
		location, err := time.LoadLocation(timezone)

		if err != nil {
			utils.Failed(w, -1)
			return
		}

		paymentDate := time.Now().In(location)

		if paymentDate.Day() > PAYMENT_DAY {
			paymentDate = paymentDate.AddDate(0, 1, 0)
		}

		dateStr := strconv.Itoa(paymentDate.Year()) + "-" + strconv.Itoa(int(paymentDate.Month())) + "-" + strconv.Itoa(paymentDate.Day())
		DbAddPayment(adminId, paymentDto.UserId, dateStr)
	}

	utils.Success(w, nil)
}

func ChangePassword(w http.ResponseWriter, adminId int, changePasswordDto ChangePasswordDTO) {
	login := strings.ToUpper(changePasswordDto.Login)
	hash := utils.GetHash(login + "@" + changePasswordDto.Password)
	changedId := DbChangePassword(login, hash, adminId)
	if changedId > 0 {
		utils.Success(w, changedId)
	} else {
		utils.Failed(w, -1)
	}
}

func BlockUser(w http.ResponseWriter, adminId int, userIdInfo UserIdInfoDTO) {
	if userIdInfo.UserId > 0 {
		active := DbGetIsActive(userIdInfo.UserId)
		if active {
			// block
			blockedId := DbSetUserActive(userIdInfo.UserId, false, adminId)
			if blockedId > 0 {
				utils.Success(w, blockedId)
			} else {
				utils.Failed(w, -1)
			}
		} else {
			// activate
			blockedId := DbSetUserActive(userIdInfo.UserId, true, adminId)
			if blockedId > 0 {
				utils.Success(w, blockedId)
			} else {
				utils.Failed(w, -1)
			}
		}
	}
}

func DeleteUser(w http.ResponseWriter, adminId int, userIdInfo UserIdInfoDTO) {
	if userIdInfo.UserId > 0 {
		changedId := DbDeleteUser(userIdInfo.UserId, adminId)
		if changedId > 0 {
			utils.Success(w, changedId)
		} else {
			utils.Failed(w, -1)
		}
	} else {
		utils.Failed(w, -1)
	}
}

func CheckAdminLogin(w http.ResponseWriter, r *http.Request) int {
	auth := r.Header.Get("Auth")
	return tokens[auth]
}

func IsAdminLogged(auth string, w http.ResponseWriter) bool {
	if tokens[auth] > 0 {
		return true
	} else {
		utils.NoAuth(w)
		return false
	}
}
