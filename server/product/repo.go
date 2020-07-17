package product

import (
	"database/sql"
	"fmt"

	"../db"
)

func DbGetAll(userId int) (ProductData, bool) {
	var productData ProductData
	var products, ok1 = dbGetProducts(userId)
	var types, ok2 = dbGetTypes(userId)

	productData.Products = products
	productData.Types = types

	return productData, ok1 && ok2
}

func dbGetProducts(userId int) ([]Product, bool) {
	var products []Product

	statement := fmt.Sprintf(`
	SELECT 
		id,
		name
	FROM "products_product"
	WHERE user_id IS NULL OR
	user_id = %v`, userId)

	fmt.Println(statement)
	rows, err := db.Instance.Db.Query(statement)

	if err != nil {
		goto Error
	}

	for rows.Next() {
		var product Product
		err := rows.Scan(&product.Id, &product.Name)

		if err != nil {
			goto Error
		}

		products = append(products, product)
	}

	return products, true

Error:
	return products, false
}

func dbGetTypes(userId int) ([]Type, bool) {
	var types []Type

	statement := fmt.Sprintf(`
	SELECT 
		id,
		name,
		product_id
	FROM "products_product_type"
	WHERE user_id IS NULL OR
	user_id = %v`, userId)

	fmt.Println(statement)
	rows, err := db.Instance.Db.Query(statement)

	if err != nil {
		goto Error
	}

	for rows.Next() {
		var t Type
		err := rows.Scan(&t.Id, &t.Name, &t.ProductId)

		if err != nil {
			goto Error
		}

		types = append(types, t)
	}

	return types, true

Error:
	return types, false
}

func DbAddProduct(product string) int {
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

func DbAddProductType(productId int, productType string) int {
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
