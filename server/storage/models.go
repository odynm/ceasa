package storage

type ItemDto struct {
	Product     int    `json:"product"`
	ProductType int    `json:"productType"`
	Description string `json:"description"`
	Amount      int    `json:"amount"`
}

type StorageItem struct {
	Id              int    `json:"id"`
	ProductId       int    `json:"productId"`
	ProductName     string `json:"productName"`
	ProductTypeId   int    `json:"productTypeId"`
	ProductTypeName string `json:"productTypeName"`
	Description     string `json:"description"`
	Amount          int    `json:"amount"`
}
