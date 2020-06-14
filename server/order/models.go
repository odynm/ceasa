package order

import (
	"time"

	"../client"
)

const (
	S_Deleted  int = 0
	S_Blocked  int = 1
	S_Released int = 2
	S_Carrying int = 3
	S_Done     int = 4
)

type ProductDto struct {
	StorageItemId int `json:"storageItem"`
	UnitPrice     int `json:"unitPrice"`
	Quantity      int `json:"quantity"`
}

type ProductCreation struct {
	OrderId         int
	ProductId       int
	ProductTypeId   int
	DescriptionId   int
	UnitPrice       int
	Quantity        int
	StorageQuantity int
}

type OrderDto struct {
	Client   client.ClientDto `json:"client"`
	Products []ProductDto     `json:"products"`
	Urgent   bool             `json:"urgent"`
	Released bool             `json:"released"`
}

type OrderCreation struct {
	ClientId    int
	ProductsIds []int
	Urgent      bool
	CreatedAt   time.Time
	ReleasedAt  time.Time
}
