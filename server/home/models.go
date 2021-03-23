package home

type HomeItem struct {
	Id                int    `json:"id"`
	ProductId         int    `json:"productId"`
	ProductName       string `json:"productName"`
	ProductTypeId     int    `json:"productTypeId"`
	ProductTypeName   string `json:"productTypeName"`
	Description       string `json:"description"`
	CostPrice         int    `json:"costPrice"`
	Amount            int    `json:"amount"`
	SoldStorageAmount int    `json:"soldStorageAmount"`
	Sold              int    `json:"sold"`
	TotalEarned       int    `json:"totalEarned"`
}

type DailyBalance struct {
	TotalEarned    int `json:"totalEarned"`
	TotalCostPrice int `json:"totalCostPrice"`
	TotalProfit    int `json:"totalProfit"`
}

type HomeBalance struct {
	List    []HomeItem   `json:"list"`
	Balance DailyBalance `json:"balance"`
}
