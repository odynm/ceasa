package home

import (
	"net/http"

	"ceasa/additionalCost"
	"ceasa/utils"
)

func Get(userId int, timezone string, w http.ResponseWriter) {
	homeList := DbGetHomeItems(userId, timezone)
	additionalCostTotal := additionalCost.DbGetTotalAdditionalCostForDay(userId, timezone)

	dailyBalance := calculateDailyBalance(homeList, additionalCostTotal)

	response := HomeBalance{
		homeList,
		dailyBalance,
	}

	utils.Success(w, response)
}

func calculateDailyBalance(homeItem []HomeItem, additionalCostTotal int) DailyBalance {
	dailyBalance := DailyBalance{}
	if homeItem != nil {
		for _, item := range homeItem {
			if item.Sold > 0 {
				dailyBalance.TotalCostPrice = dailyBalance.TotalCostPrice + item.CostPrice*item.SoldStorageAmount
				dailyBalance.TotalProfit = dailyBalance.TotalProfit + item.TotalEarned - item.CostPrice*item.Sold
			}
			dailyBalance.TotalEarned = dailyBalance.TotalEarned + item.TotalEarned
		}
	}

	dailyBalance.TotalCostPrice += additionalCostTotal
	dailyBalance.TotalProfit -= additionalCostTotal

	return dailyBalance
}
