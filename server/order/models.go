package order

import (
	"time"

	"ceasa/client"
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
	Amount        int `json:"amount"`
}

type OrderProduct struct {
	Id            int
	OrderId       int
	StorageItemId int
	UnitPrice     int
	Amount        int
	StorageAmount int
}

type OrderDto struct {
	Id                 int              `json:"id"`
	Client             client.ClientDto `json:"client"`
	Products           []ProductDto     `json:"products"`
	Urgent             bool             `json:"urgent"`
	Released           bool             `json:"released"`
	ProductListIsDirty bool             `json:"productListIsDirty"`
	Status             int              `json:"status"`
}

type OrderCreation struct {
	ClientId    int
	ProductsIds []int
	Urgent      bool
	Status      int
	CreatedAt   time.Time
	ReleasedAt  time.Time
}

type OrderListItemProduct struct {
	Id              int    `json:"id"`
	ProductId       int    `json:"productId"`
	ProductName     string `json:"productName"`
	ProductTypeId   int    `json:"productTypeId"`
	ProductTypeName string `json:"productTypeName"`
	Description     string `json:"description"`
	CostPrice       int    `json:"costPrice"`
	UnitPrice       int    `json:"unitPrice"`
	Amount          int    `json:"amount"`
	StorageAmount   int    `json:"storageAmount"`
}

type OrderListItem struct {
	Id          int                    `json:"id"`
	Client      client.ClientDto       `json:"client"`
	Products    []OrderListItemProduct `json:"products"`
	Urgent      bool                   `json:"urgent"`
	CreatedAt   time.Time              `json:"createdAt"`
	ReleasedAt  time.Time              `json:"releasedAt"`
	CompletedAt time.Time              `json:"completedAt"`
	Status      int                    `json:"status"`
	Loader      string                 `json:"loader"`
}

type OrderIds struct {
	Id       int
	ClientId int
}
