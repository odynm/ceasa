package storage

import "database/sql"

type ItemDto struct {
	Product     int    `json:"product"`
	ProductType int    `json:"productType"`
	Description string `json:"description"`
	Amount      int    `json:"amount"`
}

type StorageItemFull struct {
	Id              int    `json:"id"`
	ProductId       int    `json:"productId"`
	ProductName     string `json:"productName"`
	ProductTypeId   int    `json:"productTypeId"`
	ProductTypeName string `json:"productTypeName"`
	Description     string `json:"description"`
	Amount          int    `json:"amount"`
}

type StorageItem struct {
	Id            int           `json:"id"`
	ProductId     int           `json:"productId"`
	ProductTypeId sql.NullInt32 `json:"productTypeId"`
	DescriptionId sql.NullInt32 `json:"description"`
	Amount        int           `json:"amount"`
}
