package home

import (
	"net/http"

	"ceasa/utils"
)

func Get(userId int, w http.ResponseWriter) {
	homeList := DbGetHomeItems(userId)

	dailyBalance := calculateDailyBalance(homeList)

	response := HomeBalance{
		homeList,
		dailyBalance,
	}

	utils.Success(w, response)
}

func calculateDailyBalance(homeItem []HomeItem) DailyBalance {
	dailyBalance := DailyBalance{}
	if homeItem != nil {
		for _, item := range homeItem {
			if item.Sold > 0 {
				dailyBalance.TotalCostPrice = dailyBalance.TotalCostPrice + item.CostPrice
				dailyBalance.TotalProfit = dailyBalance.TotalProfit + item.TotalEarned - item.CostPrice
			} else {
				dailyBalance.TotalCostPrice = 0
				dailyBalance.TotalProfit = dailyBalance.TotalProfit + item.TotalEarned
			}
			dailyBalance.TotalEarned = dailyBalance.TotalEarned + item.TotalEarned
		}
	}

	return dailyBalance
}
