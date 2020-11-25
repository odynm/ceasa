package carry

import (
	"net/http"

	orderPkg "ceasa/order"
	"ceasa/storage"
	"ceasa/utils"
)

func StartCarrying(orderId int, userId int, loaderId int, w http.ResponseWriter) {
	response := DbStartCarrying(orderId, userId, loaderId)
	if response > 0 {
		utils.Success(w, response)
	} else {
		utils.Failed(w, -1)
	}
}

func FinishCarrying(order OrderCarryFinish, userId int, loaderId int, w http.ResponseWriter) {
	response := DbFinishCarrying(order.OrderId, userId, loaderId)

	// Put not delivered items back on storage
	// In future we will store those rejected items for consultation
	if order.Products != nil {
		for _, product := range order.Products {
			storageId, ok := DbGetStorageIdFromProductOrderId(userId, product.Id)
			if ok {
				storage.DbIncreaseAmount(storageId, product.Amount-product.AmountDelivered, userId)
				// So that we don't have problems in the balances, we gonna take the item away from order
				// If we want to know the not delivered items, we need a different table to keep track of that
				orderPkg.DbDecreaseAmountOfProduct(order.OrderId, storageId, product.Amount-product.AmountDelivered, userId)
			}
		}
	}

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
