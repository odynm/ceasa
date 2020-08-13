package order

import (
	"net/http"
	"time"

	"../client"
	"../storage"
	"../utils"
)

func Add(orderDto OrderDto, userId int, w http.ResponseWriter) int {
	var clientId int
	var orderId int
	var order OrderCreation

	clientId = client.AddOrUpdateClient(orderDto.Client, userId, w)
	if clientId == 0 {
		goto Error
	}

	order = OrderCreation{
		ClientId:  clientId,
		Urgent:    orderDto.Urgent,
		CreatedAt: time.Now(),
		Status:    S_Blocked,
	}
	if orderDto.Released {
		order.ReleasedAt = order.CreatedAt
		order.Status = S_Released
	}
	orderId = DbCreateOrder(order, userId)
	if orderId == 0 {
		goto Error
	}
	for _, product := range orderDto.Products {
		storageItem := storage.DbGetById(product.StorageItemId, userId)

		var amount int
		if storageItem.Amount < product.Amount {
			amount = storageItem.Amount
		} else {
			amount = product.Amount
		}
		productCreation := ProductCreation{
			OrderId:       orderId,
			ProductId:     storageItem.ProductId,
			ProductTypeId: storageItem.ProductTypeId,
			DescriptionId: storageItem.DescriptionId,
			UnitPrice:     product.UnitPrice,
			Amount:        product.Amount,
			StorageAmount: amount,
		}

		if storage.DbUpdateAmount(product.StorageItemId, storageItem.Amount-amount, userId) {
			DbCreateProduct(productCreation, userId)
		} else {
			goto Error
		}
	}
	return orderId

Error:
	utils.BadRequest(w, "Order")
	return 0
}

func GetForVendor(userId int, w http.ResponseWriter) {
	response, ok := DbGetOrdersVendor(userId)
	if ok {
		w.Header().Set("Content-Type", "application/json")
		utils.Success(w, response)
	} else {
		utils.Failed(w, -1)
	}
}
