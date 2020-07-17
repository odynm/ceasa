package product

type ProductData struct {
	Products []Product `json:"products"`
	Types    []Type    `json:"types"`
}

type Product struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type Type struct {
	Id        int    `json:"id"`
	Name      string `json:"name"`
	ProductId int    `json:"productId"`
}
