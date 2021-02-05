package additionalCost

import (
	"net/http"
	"time"

	"ceasa/utils"
)

func Create(userId int, additionalCost AdditionalCostDTO, w http.ResponseWriter) {
	additionalCost.CreatedAt = time.Now().UTC()
	response := DbCreateAdditionalCost(userId, additionalCost)
	if response > 0 {
		utils.Success(w, response)
	} else {
		utils.Failed(w, -1)
	}
}

func Get(userId int, timezone string, w http.ResponseWriter) {
	additionalCosts := DbGetAdditionalCosts(userId, timezone)
	utils.Success(w, additionalCosts)
}

func Delete(userId int, additionalCostId int, w http.ResponseWriter) {
	ok := DbDeleteAdditionalCost(userId, additionalCostId)
	if ok {
		utils.Success(w, additionalCostId)
	} else {
		utils.Failed(w, -1)
	}
}
