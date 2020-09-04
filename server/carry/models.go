package carry

type OrderCarry struct {
	Id int `json:"id"`
}

type OrderCarryFinish struct {
	OrderId  int              `json:"orderId"`
	Products []OrderCarryItem `json:"products"`
}

type OrderCarryItem struct {
	Id              int `json:"id"`
	Amount          int `json:"amount"`
	AmountDelivered int `json:"amountDelivered"`
}
