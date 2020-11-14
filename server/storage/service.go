package storage

import (
	"net/http"

	"ceasa/utils"
)

func Add(itemDto ItemDto, userId int, w http.ResponseWriter) {
	var result int

	descriptionId := DbCreateOrGetDescriptionId(itemDto.Description, userId)
	equalId := DbGetEqualId(itemDto.Product, itemDto.ProductType, descriptionId, itemDto.CostPrice, userId)
	if equalId > 0 {
		DbIncreaseAmount(equalId, itemDto.Amount, userId)
		utils.Success(w, result)
	} else {
		result = DbCreateStorageItem(itemDto, userId, descriptionId)
		if result == 0 {
			utils.Failed(w, -1)
		} else {
			utils.Success(w, result)
		}
	}
}

func Edit(itemDto ItemDto, userId int, w http.ResponseWriter) {
	var result int

	descriptionId := DbCreateOrGetDescriptionId(itemDto.Description, userId)
	equalId := DbGetEqualId(itemDto.Product, itemDto.ProductType, descriptionId, itemDto.CostPrice, userId)

	if equalId > 0 {
		DbDeleteStorageForce(userId, itemDto.Id)
		DbIncreaseAmount(equalId, itemDto.Amount, userId)
		utils.Success(w, result)
	} else {
		result = DbUpdateStorageItem(itemDto, userId, descriptionId)
		if result == 0 {
			utils.Failed(w, -1)
		} else {
			utils.Success(w, result)
		}
	}
}

func Get(userId int, w http.ResponseWriter) {
	response := DbGetAllFull(userId)
	utils.Success(w, response)
}

func DeleteStorage(userId int, storageId int, w http.ResponseWriter) {
	ok := DbDeleteStorage(userId, storageId)
	if !ok {
		utils.Failed(w, -1)
	}
}

func Reset(userId int, w http.ResponseWriter) {
	ok := DbResetStorage(userId)
	if !ok {
		utils.Failed(w, -1)
	}
}
