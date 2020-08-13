package order

import (
	"database/sql"
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
	Amount        int `json:"amount"`
}

type ProductCreation struct {
	OrderId       int
	ProductId     int
	ProductTypeId sql.NullInt32
	DescriptionId sql.NullInt32
	UnitPrice     int
	Amount        int
	StorageAmount int
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
	UnitPrice       int    `json:"unitPrice"`
	Amount          int    `json:"amount"`
	StorageAmount   int    `json:"storageAmount"`
}

type OrderListItem struct {
	Id         int                    `json:"id"`
	Client     client.ClientDto       `json:"client"`
	Products   []OrderListItemProduct `json:"products"`
	Urgent     bool                   `json:"urgent"`
	CreatedAt  time.Time              `json:"createdAt"`
	ReleasedAt time.Time              `json:"releasedAt"`
	Status     int                    `json:"status"`
}
