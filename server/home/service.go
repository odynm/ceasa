package home

import (
	"net/http"

	"ceasa/utils"
)

func Get(userId int, timezone string, w http.ResponseWriter) {
	homeList := DbGetHomeItems(userId, timezone)

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
				dailyBalance.TotalCostPrice = dailyBalance.TotalCostPrice + item.CostPrice*item.Sold
				dailyBalance.TotalProfit = dailyBalance.TotalProfit + item.TotalEarned - item.CostPrice*item.Sold
			}
			dailyBalance.TotalEarned = dailyBalance.TotalEarned + item.TotalEarned
		}
	}

	return dailyBalance
}
