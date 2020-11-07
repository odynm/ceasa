package order

import (
	"net/http"
	"time"

	"ceasa/client"
	"ceasa/device"
	"ceasa/notification"
	"ceasa/storage"
	"ceasa/utils"
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
		CreatedAt: time.Now().UTC(),
		Status:    orderDto.Status,
	}
	if orderDto.Status == S_Released {
		order.ReleasedAt = order.CreatedAt
	}
	orderId = DbCreateOrder(order, userId)
	if orderId == 0 {
		goto Error
	}

	if !addProducts(userId, orderId, orderDto.Products) {
		goto Error
	}

	return orderId

Error:
	utils.BadRequest(w, "Order")
	return 0
}

func Edit(orderDto OrderDto, userId int, w http.ResponseWriter) int {
	var clientId int
	var orderId int
	var order OrderCreation
	var ok bool

	orderStatus := DbGetOrderStatus(userId, orderDto.Id)

	if orderStatus == S_Done || orderStatus == S_Deleted {
		utils.Failed(w, utils.ORDER_CANT_EDIT)
		goto Error
	}

	clientId = client.AddOrUpdateClient(orderDto.Client, userId, w)
	if clientId == 0 {
		utils.Failed(w, utils.ORDER_GENERIC)
		goto Error
	}

	order = OrderCreation{
		ClientId: clientId,
		Urgent:   orderDto.Urgent,
		Status:   orderDto.Status,
	}
	if orderDto.Status == S_Released {
		order.ReleasedAt = time.Now().UTC()
	}
	orderId = DbEditOrder(order, orderDto.Id, userId)
	if orderId == 0 {
		utils.Failed(w, utils.ORDER_GENERIC)
		goto Error
	}
	if orderDto.ProductListIsDirty {
		var dbStoredProducts []OrderProduct
		dbStoredProducts, ok = DbGetOrderProducts(userId, orderId)
		if !ok {
			utils.Failed(w, utils.ORDER_GENERIC)
			goto Error
		}

		// Update storage
		/*
			* We add all new items that are not in db to the toAddProductList
			* We compare the stored with the new items
				* If there's a deleted one, we readd the products to store
				* If there's a updated one, we:
					* we readd the products to store
					* add to toAddProductList
		*/
		var toAddProductList []ProductDto
		for _, newProduct := range orderDto.Products {
			isNewItem := true
			for _, dbStoredProduct := range dbStoredProducts {
				if newProduct.StorageItemId == dbStoredProduct.StorageItemId {
					isNewItem = false
					break
				}
			}
			if isNewItem {
				toAddProductList = append(toAddProductList, newProduct)
			}
		}

		for _, dbStoredProduct := range dbStoredProducts {
			isDeletedItem := true
			for _, newProduct := range orderDto.Products {
				if newProduct.StorageItemId == dbStoredProduct.StorageItemId {
					isDeletedItem = false
					// Update storage
					if newProduct.Amount != dbStoredProduct.Amount {
						storage.DbIncreaseAmount(newProduct.StorageItemId, dbStoredProduct.StorageAmount, userId)
						toAddProductList = append(toAddProductList, newProduct)
					}
				}
				if isDeletedItem {
					storage.DbIncreaseAmount(newProduct.StorageItemId, dbStoredProduct.Amount, userId)
				}
			}
		}

		ok = DbDeleteProductsFromOrderId(userId, orderId)
		if !ok {
			utils.Failed(w, utils.ORDER_GENERIC)
			goto Error
		}

		ok = addProducts(userId, orderId, orderDto.Products)
		if !ok {
			utils.Failed(w, utils.ORDER_GENERIC)
			goto Error
		}
	}

	if orderStatus == S_Carrying {
		relatedProducts, _ := DbGetOrderProductsFull(userId, orderId)
		loaderId := DbGetLoaderId(userId, orderId)
		device := device.DbGetDeviceHashFromLoaderId(loaderId)

		notification.SendNotification(
			device,
			"Pedido EDITADO",
			"Um pedido foi editado pelo vendedor",
			NotificationData{
				orderDto.Client,
				relatedProducts,
			})
	}

	return orderId

Error:
	return 0
}

func GetIds(userId int, id int, w http.ResponseWriter) (OrderIds, bool) {
	orderDto, ok := DbOrderGetIds(userId, id)
	if ok {
		return orderDto, ok
	} else {
		utils.Failed(w, -1)
		return orderDto, ok
	}
}

func GetForVendor(userId int, w http.ResponseWriter) {
	response, ok := DbGetOrdersVendor(userId)
	if ok {
		utils.Success(w, response)
	} else {
		utils.Failed(w, -1)
	}
}

func GetForLoader(userId int, w http.ResponseWriter) {
	response, ok := DbGetOrdersLoader(userId)
	if ok {
		utils.Success(w, response)
	} else {
		utils.Failed(w, -1)
	}
}

func DeleteOrder(userId int, orderId int, w http.ResponseWriter) {
	dbStoredProducts, ok := DbGetOrderProducts(userId, orderId)
	if ok {
		for _, dbStoredProduct := range dbStoredProducts {
			storage.DbIncreaseAmount(dbStoredProduct.StorageItemId, dbStoredProduct.Amount, userId)
		}
		ok = DbDeleteOrder(userId, orderId)
		if ok {
			utils.Success(w, orderId)

			orderStatus := DbGetOrderStatus(userId, orderId)

			if orderStatus == S_Carrying {
				relatedProducts, _ := DbGetOrderProductsFull(userId, orderId)
				client := client.DbGetClientFromOrder(userId, orderId)
				loaderId := DbGetLoaderId(userId, orderId)
				device := device.DbGetDeviceHashFromLoaderId(loaderId)

				notification.SendNotification(
					device,
					"Pedido CANCELADO",
					"Um pedido foi cancelado pelo vendedor",
					NotificationData{
						client,
						relatedProducts,
					})
			}
		} else {
			utils.Failed(w, -1)
		}
	} else {
		utils.Failed(w, -1)
	}
	if ok {
		//
		// For now, we will maintain the products instead of deleting them
		//
		/*ok = DbDeleteProductsFromOrderId(userId, orderId)
		if ok {
			DbDeleteOrder(userId, orderId)
			if !ok {
				utils.Failed(w, -1)
			}
		} else {
			utils.Failed(w, -1)
		}*/
	} else {
		utils.Failed(w, -1)
	}
}

func addProducts(userId int, orderId int, products []ProductDto) bool {
	for _, product := range products {
		storageItem := storage.DbGetById(product.StorageItemId, userId)

		if storageItem.Id == 0 {
			return false
		}

		var amount int
		if storageItem.Amount < product.Amount {
			amount = storageItem.Amount
		} else {
			amount = product.Amount
		}
		productCreation := OrderProduct{
			OrderId:       orderId,
			StorageItemId: storageItem.Id,
			UnitPrice:     product.UnitPrice,
			Amount:        product.Amount,
			StorageAmount: amount,
		}

		if storage.DbUpdateAmount(product.StorageItemId, storageItem.Amount-amount, userId) {
			productId := DbCreateProduct(productCreation, userId)
			if productId == 0 {
				return false
			}
		} else {
			return false
		}
	}
	return true
}
