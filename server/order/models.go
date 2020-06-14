package order

import "../client"

type ProductDto struct {
	StorageItem int `json:"storageItem"`
	UnitPrice   int `json:"unitPrice"`
	Quantity    int `json:"quantity"`
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
	Released    bool
}
