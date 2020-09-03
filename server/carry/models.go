package carry

type OrderCarry struct {
	Id int `json:"id"`
}

type OrderCarryFinish struct {
	OrderId  int              `json:"orderId"`
	Products []OrderCarryItem `json:"products"`
}

type OrderCarryItem struct {
	Id              int    `json:"id"`
	ProductId       int    `json:"productId"`
	ProductTypeId   int    `json:"productTypeId"`
	Description     string `json:"description"`
	Amount          int    `json:"amount"`
	AmountDelivered int    `json:"amountDelivered"`
}
