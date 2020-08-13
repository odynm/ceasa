package order

import (
	"database/sql"
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

func DbGetOrdersVendor(userId int) ([]OrderListItem, bool) {
	schema := fmt.Sprint("u", userId)

	var orderList []OrderListItem

	statement := fmt.Sprintf(`
	SELECT 
		"order".id,
		"client".key AS "client_key", 
		"client".place AS "client_place",
		"client".vehicle AS "client_vehicle",
		"order".urgent,
		"order".created_at,
		"order".released_at,
		"order".status
	FROM %v.order_order AS "order"
	INNER JOIN %v.order_client as "client" ON "order".client_id = "client".id
	`, schema, schema)

	fmt.Println(statement)
	rows, err := db.Instance.Db.Query(statement)

	if err != nil {
		goto Error
	}

	for rows.Next() {
		var orderItem OrderListItem
		err := rows.Scan(&orderItem.Id,
			&orderItem.Client.Key,
			&orderItem.Client.Place,
			&orderItem.Client.Vehicle,
			&orderItem.Urgent,
			&orderItem.CreatedAt,
			&orderItem.ReleasedAt,
			&orderItem.Status)

		if err != nil {
			goto Error
		}

		var orderProducts []OrderListItemProduct

		statement := fmt.Sprintf(`
		SELECT 
			id,
			product_id,
			(SELECT name FROM public.products_product WHERE id = product_id) as product_name,
			product_type_id,
			(SELECT name FROM public.products_product_type WHERE id = product_type_id) as product_type_name,
			(SELECT description FROM %v.storage_item_description WHERE id = description_id) as description,
			unit_price,
			amount,
			storage_amount
		FROM %v.order_product WHERE order_id = %v
		`, schema, schema, orderItem.Id)

		fmt.Println(statement)
		rows, err := db.Instance.Db.Query(statement)

		if err != nil {
			goto Error
		}

		var productTypeIdNullable sql.NullInt32
		var productTypeNameNullable sql.NullString
		for rows.Next() {
			var orderProduct OrderListItemProduct
			err := rows.Scan(&orderProduct.Id,
				&orderProduct.ProductId,
				&orderProduct.ProductName,
				&productTypeIdNullable,
				&productTypeNameNullable,
				&orderProduct.Description,
				&orderProduct.UnitPrice,
				&orderProduct.Amount,
				&orderProduct.StorageAmount)

			if productTypeIdNullable.Valid {
				orderProduct.ProductTypeId = int(productTypeIdNullable.Int32)
			}
			if productTypeNameNullable.Valid {
				orderProduct.ProductTypeName = string(productTypeNameNullable.String)
			}

			if err != nil {
				goto Error
			}

			orderProducts = append(orderProducts, orderProduct)
		}

		orderItem.Products = orderProducts
		orderList = append(orderList, orderItem)
	}

	return orderList, true
Error:
	return nil, false
}
