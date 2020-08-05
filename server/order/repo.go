package order

import (
	"fmt"

	"../db"
)

func DbCreateProduct(product ProductCreation, userId int) int {
	schema := fmt.Sprint("u", userId)

	var id int

	statement := fmt.Sprintf(`
			INSERT INTO %v."order_product" (order_id, product_id, product_type_id, description_id, amount, storage_amount, unit_price)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			RETURNING id`, schema)
	err := db.Instance.Db.
		QueryRow(statement, product.OrderId, product.ProductId, product.ProductTypeId, product.DescriptionId, product.Amount, product.StorageAmount, product.UnitPrice).
		Scan(&id)
	if err != nil {
		goto Error
	}

	return id
Error:
	return 0
}

func DbCreateOrder(order OrderCreation, userId int) int {
	schema := fmt.Sprint("u", userId)

	var itemId int

	statement := fmt.Sprintf(`
				INSERT INTO %v."order_order" (client_id, urgent, status, created_at, released_at)
				VALUES ($1, $2, $3, $4, $5)
				RETURNING id`, schema)
	err := db.Instance.Db.
		QueryRow(statement, order.ClientId, order.Urgent, S_Blocked, order.CreatedAt, order.ReleasedAt).
		Scan(&itemId)
	if err != nil {
		goto Error
	}

	return itemId
Error:
	return 0
}

func DbGetStorage(userId int) {
	// 	schema := fmt.Sprint("u", userId)

	// 	var storageItems []StorageItem

	// 	statement := fmt.Sprintf(`
	// 	SELECT
	// 		id,
	// 		product_id,
	// 		(SELECT name FROM public.products_product WHERE id = product_id) as product_description,
	// 		product_type_id,
	// 		(SELECT name FROM public.products_product_type WHERE id = product_type_id) as product_type_name,
	// 		(SELECT description FROM %v.storage_item_description WHERE id = description_id) as description,
	// 		amount
	// 	FROM %v.storage_item`, schema, schema)

	// 	fmt.Println(statement)
	// 	rows, err := db.Instance.Db.Query(statement)

	// 	if err != nil {
	// 		goto Error
	// 	}

	// 	for rows.Next() {
	// 		var storageItem StorageItem
	// 		err := rows.Scan(&storageItem.Id,
	// 			&storageItem.ProductId,
	// 			&storageItem.ProductName,
	// 			&storageItem.ProductTypeId,
	// 			&storageItem.ProductTypeName,
	// 			&storageItem.Description,
	// 			&storageItem.Amount)

	// 		if err != nil {
	// 			goto Error
	// 		}

	// 		storageItems = append(storageItems, storageItem)
	// 	}

	// 	return storageItems
	// Error:
}
