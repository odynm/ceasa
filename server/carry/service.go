package carry

import (
	"net/http"

	"../utils"
)

func StartCarrying(orderId int, userId int, loaderId int, w http.ResponseWriter) {
	response := DbStartCarrying(orderId, userId, loaderId)
	if response > 0 {
		utils.Success(w, response)
	} else {
		utils.Failed(w, -1)
	}
}

func FinishCarrying(orderId int, userId int, loaderId int, w http.ResponseWriter) {
	response := DbFinishCarrying(orderId, userId, loaderId)
	if response > 0 {
		utils.Success(w, response)
	} else {
		utils.Failed(w, -1)
	}
}

func GetActiveOrders(userId int, loaderId int, w http.ResponseWriter) {
	response, ok := DbGetActiveOrders(userId, loaderId)
	if ok {
		utils.Success(w, response)
	} else {
		utils.Failed(w, -1)
	}
}
