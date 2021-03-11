package order

import (
	"net/http"
	"sort"
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

	errors, ok := checkOrderAddCanBeFulfilled(userId, orderDto)

	if !ok {
		goto Error
	}

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
	if !orderDto.GenerateLoad {
		order.CompletedAt = order.CreatedAt
		order.ReleasedAt = order.CreatedAt
		order.Status = S_Done
	}
	orderId = DbCreateOrder(order, userId)
	if orderId == 0 {
		goto Error
	}

	if !addProducts(userId, orderId, orderDto.Products) {
		goto Error
	}

	// TODO add notification, but this will be sent to ALL loaders
	// device := device.DbGetDeviceHashFromLoaderId(loaderId)

	// notification.SendNotification(
	// 	device,
	// 	"Pedido CANCELADO",
	// 	"Um pedido foi cancelado pelo vendedor",
	// 	NotificationData{
	// 		Type:     "add",
	// 		Client:   client,
	// 		Products: relatedProducts,
	// 	},
	// )

	return orderId

Error:
	utils.FailedWithObj(w, -1, errors)
	return 0
}

func Edit(orderDto OrderDto, userId int, w http.ResponseWriter) int {
	var clientId int
	var orderId int
	var order OrderCreation
	var ok bool
	var errors []OrderFulfillmentError

	orderStatus := DbGetOrderStatus(userId, orderDto.Id)

	if orderStatus == S_Done || orderStatus == S_Deleted {
		utils.Failed(w, utils.ORDER_CANT_EDIT)
		goto Error
	}

	errors, ok = checkOrderEditCanBeFulfilled(userId, orderDto)

	if !ok {
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
		var dbStoredProducts []OrderProductForEdit
		dbStoredProducts, ok = DbGetOrderProductsForEdit(userId, orderId)
		if !ok {
			utils.Failed(w, utils.ORDER_GENERIC)
			goto Error
		}

		// TODO better naming
		dbStoredProductsDistinct := createCurrentDbOrderItems(dbStoredProducts)

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
		for _, newOrderProduct := range orderDto.Products {
			isNewItem := true
			for _, dbStoredProduct := range dbStoredProductsDistinct {
				if newOrderProduct.ProductId == dbStoredProduct.ProductId &&
					newOrderProduct.ProductTypeId == dbStoredProduct.ProductTypeId &&
					newOrderProduct.DescriptionId == dbStoredProduct.DescriptionId {
					isNewItem = false
					break
				}
			}
			if isNewItem {
				toAddProductList = append(toAddProductList, newOrderProduct)
			}
		}

		for _, dbStoredProduct := range dbStoredProductsDistinct {
			isDeletedItem := true
			for _, newOrderProduct := range orderDto.Products {
				if newOrderProduct.ProductId == dbStoredProduct.ProductId &&
					newOrderProduct.ProductTypeId == dbStoredProduct.ProductTypeId &&
					newOrderProduct.DescriptionId == dbStoredProduct.DescriptionId {
					isDeletedItem = false
					// Update storage
					for _, storedProductId := range dbStoredProduct.StorageIds {
						storage.DbIncreaseAmount(storedProductId.Id, storedProductId.StorageAmount, userId)
					}
					toAddProductList = append(toAddProductList, newOrderProduct)
				}
				if isDeletedItem {
					for _, storedProductId := range dbStoredProduct.StorageIds {
						storage.DbIncreaseAmount(storedProductId.Id, storedProductId.StorageAmount, userId)
					}
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
				Type:     "edit",
				Client:   orderDto.Client,
				Products: relatedProducts,
			},
		)
	}

	return orderId

Error:
	utils.FailedWithObj(w, -1, errors)
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

func GetForVendor(userId int, timezone string, w http.ResponseWriter) {
	response, ok := DbGetOrdersVendor(userId, timezone)
	if ok {
		utils.Success(w, response)
	} else {
		utils.Failed(w, -1)
	}
}

func GetForLoader(userId int, timezone string, w http.ResponseWriter) {
	response, ok := DbGetOrdersLoader(userId, timezone)
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
		orderStatus := DbGetOrderStatus(userId, orderId)
		ok = DbDeleteOrder(userId, orderId)
		if ok {
			utils.Success(w, orderId)

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
						Type:     "delete",
						Client:   client,
						Products: relatedProducts,
					},
				)
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

func checkOrderAddCanBeFulfilled(userId int, orderDto OrderDto) ([]OrderFulfillmentError, bool) {
	var errors []OrderFulfillmentError

	// TODO make this faster
	// This is a time consuming check, because it envolves two blocking queries
	// The first one can be taken as a list, the second one can be batched to run after the process
	for _, product := range orderDto.Products {
		amountInDb := storage.DbGetProductAmount(userId, product.ProductId, product.ProductTypeId, product.DescriptionId)
		if amountInDb < product.StorageAmount {
			description := storage.DbGetDescriptionFromId(userId, product.DescriptionId)
			e := OrderFulfillmentError{
				ProductId:     product.ProductId,
				ProductTypeId: product.ProductTypeId,
				Description:   description,
				MissingAmount: product.StorageAmount - amountInDb,
			}

			errors = append(errors, e)
		}
	}

	return errors, len(errors) == 0
}

func checkOrderEditCanBeFulfilled(userId int, orderDto OrderDto) ([]OrderFulfillmentError, bool) {
	var errors []OrderFulfillmentError

	for _, product := range orderDto.Products {
		amountInDb := storage.DbGetProductAmount(userId, product.ProductId, product.ProductTypeId, product.DescriptionId)
		previusOrderAmount := storage.DbGetProductAmountFromOrder(userId, orderDto.Id, product.ProductId, product.ProductTypeId, product.DescriptionId)
		if amountInDb+previusOrderAmount < product.StorageAmount {
			e := OrderFulfillmentError{
				ProductId:     product.ProductId,
				ProductTypeId: product.ProductTypeId,
				MissingAmount: product.StorageAmount - amountInDb - previusOrderAmount,
			}

			errors = append(errors, e)
		}
	}

	return errors, len(errors) == 0
}

func addProducts(userId int, orderId int, products []ProductDto) bool {
	for _, product := range products {
		storageItems := storage.DbGetAllByProductId(product.ProductId, product.ProductTypeId, product.DescriptionId, userId)

		if storageItems == nil {
			return false
		}

		sort.Slice(storageItems, func(i int, j int) bool {
			return storageItems[i].CostPrice < storageItems[j].CostPrice
		})

		var totalAmount int
		for _, storageItem := range storageItems {
			if product.Amount == totalAmount {
				break
			}

			var amountToAdd int
			var amountStorageToAdd int

			if storageItem.Amount < product.Amount-totalAmount {
				amountStorageToAdd = storageItem.Amount
			} else {
				amountStorageToAdd = product.Amount - totalAmount
			}

			totalAmount += amountStorageToAdd

			if product.Amount == totalAmount {
				// If we are done, we want to put all the storage exceeded items
				// in the last item of the order, which is this one
				amountToAdd += amountStorageToAdd + (product.Amount - product.StorageAmount)
			} else {
				amountToAdd += amountStorageToAdd
			}

			productCreation := OrderProduct{
				OrderId:       orderId,
				StorageItemId: storageItem.Id,
				UnitPrice:     product.UnitPrice,
				Amount:        product.Amount,
				StorageAmount: amountStorageToAdd,
			}

			if storage.DbUpdateAmount(storageItem.Id, storageItem.Amount-amountStorageToAdd, userId) {
				productId := DbCreateProduct(productCreation, userId)
				if productId == 0 {
					return false
				}
			} else {
				return false
			}
		}
	}

	return true
}

func createNewCurrentDbOrderItem(dbStoredProduct OrderProductForEdit, currentDbOrderItemProducts []CurrentDbOrderItemProduct) CurrentDbOrderItem {
	var currentDbOrderItem CurrentDbOrderItem

	currentDbOrderItem.ProductId = dbStoredProduct.ProductId
	currentDbOrderItem.ProductTypeId = dbStoredProduct.ProductTypeId
	currentDbOrderItem.DescriptionId = dbStoredProduct.DescriptionId

	for _, storedData := range currentDbOrderItemProducts {
		currentDbOrderItem.Amount += storedData.Amount
		currentDbOrderItem.StorageAmount += storedData.StorageAmount
	}

	currentDbOrderItem.StorageIds = currentDbOrderItemProducts

	return currentDbOrderItem
}

func createCurrentDbOrderItems(dbStoredProducts []OrderProductForEdit) []CurrentDbOrderItem {
	var currentDbOrderItems []CurrentDbOrderItem
	var currentDbOrderItemProducts []CurrentDbOrderItemProduct

	var lastProductId, lastProductTypeId, lastDescriptionId int

	for i, dbStoredProduct := range dbStoredProducts {
		if i != 0 &&
			lastProductId != dbStoredProduct.ProductId &&
			lastProductTypeId != dbStoredProduct.ProductTypeId &&
			lastDescriptionId != dbStoredProduct.DescriptionId {
			currentDbOrderItems = append(
				currentDbOrderItems,
				createNewCurrentDbOrderItem(dbStoredProduct, currentDbOrderItemProducts),
			)
			currentDbOrderItemProducts = nil
		}

		currentDbOrderItemProduct := CurrentDbOrderItemProduct{
			Id:            dbStoredProduct.StorageId,
			Amount:        dbStoredProduct.Amount,
			StorageAmount: dbStoredProduct.StorageAmount,
		}

		currentDbOrderItemProducts = append(currentDbOrderItemProducts, currentDbOrderItemProduct)

		lastProductId = dbStoredProduct.ProductId
		lastProductTypeId = dbStoredProduct.ProductTypeId
		lastDescriptionId = dbStoredProduct.DescriptionId
	}

	// At the end, add once more
	var lastArrayIndex = len(dbStoredProducts) - 1
	currentDbOrderItems = append(
		currentDbOrderItems,
		createNewCurrentDbOrderItem(dbStoredProducts[lastArrayIndex], currentDbOrderItemProducts),
	)

	return currentDbOrderItems
}
