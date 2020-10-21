package home

type HomeItem struct {
	Id              int    `json:"id"`
	ProductId       int    `json:"productId"`
	ProductName     string `json:"productName"`
	ProductTypeId   int    `json:"productTypeId"`
	ProductTypeName string `json:"productTypeName"`
	Description     string `json:"description"`
	CostPrice       int    `json:"costPrice"`
	Amount          int    `json:"amount"`
	Sold            int    `json:"sold"`
	TotalEarned     int    `json:"totalEarned"`
}
