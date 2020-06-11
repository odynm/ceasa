package product

import (
	"database/sql"

	"../db"
)

func dbAddProduct(product string) int {
	statement := `
		SELECT id FROM "products_product"
		WHERE name = $1`
	var id int
	err := db.Instance.Db.QueryRow(statement, product).Scan(&id)
	if err != nil && err != sql.ErrNoRows {
		panic(err)
	}
	if id == 0 {
		statement := `
			INSERT INTO "products_product" (name)
			VALUES ($1)
			RETURNING id`
		err := db.Instance.Db.QueryRow(statement, product).Scan(&id)
		if err != nil && err != sql.ErrNoRows {
			panic(err)
		}
	}

	return id
}

func dbAddProductType(productId int, productType string) int {
	statement := `
		SELECT id FROM "products_product_type"
		WHERE name = $1 AND product_id = $2`
	var id int
	err := db.Instance.Db.QueryRow(statement, productType, productId).Scan(&id)
	if err != nil && err != sql.ErrNoRows {
		panic(err)
	}
	if id == 0 {
		statement := `
			INSERT INTO "products_product_type" (name, product_id)
			VALUES ($1, $2)
			RETURNING id`
		err := db.Instance.Db.QueryRow(statement, productType, productId).Scan(&id)
		if err != nil && err != sql.ErrNoRows {
			panic(err)
		}
	}

	return id
}
