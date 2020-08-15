package order

import (
	"database/sql"
	"fmt"

	"../db"
)

func DbCreateProduct(product OrderProduct, userId int) int {
	schema := fmt.Sprint("u", userId)

	var id int

	statement := fmt.Sprintf(`
			INSERT INTO %v."order_product" (order_id, storage_id, amount, storage_amount, unit_price)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id`, schema)
	err := db.Instance.Db.
		QueryRow(statement, product.OrderId, product.StorageItemId, product.Amount, product.StorageAmount, product.UnitPrice).
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
		QueryRow(statement, order.ClientId, order.Urgent, order.Status, order.CreatedAt, order.ReleasedAt).
		Scan(&itemId)
	if err != nil {
		goto Error
	}

	return itemId
Error:
	return 0
}

func DbEditOrder(order OrderCreation, orderId int, userId int) int {
	schema := fmt.Sprint("u", userId)

	var itemId int

	statement := fmt.Sprintf(`
				UPDATE %v."order_order" SET
					client_id = $1, 
					urgent = $2, 
					status = $3, 
					released_at = $4
				WHERE id = $5
				RETURNING id`, schema)
	err := db.Instance.Db.
		QueryRow(statement, order.ClientId, order.Urgent, order.Status, order.ReleasedAt, orderId).
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

		orderProducts, ok := DbGetOrderProductsFull(userId, orderItem.Id)
		if !ok {
			goto Error
		}

		orderItem.Products = orderProducts
		orderList = append(orderList, orderItem)
	}

	return orderList, true
Error:
	return nil, false
}

func DbGetOrderProducts(userId int, orderId int) ([]OrderProduct, bool) {
	schema := fmt.Sprint("u", userId)
	var orderProducts []OrderProduct

	statement := fmt.Sprintf(`
	SELECT 
		id,
		order_id,
		storage_id,
		unit_price,
		amount,
		storage_amount
	FROM %v.order_product
	WHERE order_id = $1`, schema)

	rows, err := db.Instance.Db.Query(statement, orderId)

	if err != nil {
		return orderProducts, false
	}

	for rows.Next() {
		var orderProduct OrderProduct
		err := rows.Scan(&orderProduct.Id,
			&orderProduct.OrderId,
			&orderProduct.StorageItemId,
			&orderProduct.UnitPrice,
			&orderProduct.Amount,
			&orderProduct.StorageAmount)

		if err != nil {
			return orderProducts, false
		}

		orderProducts = append(orderProducts, orderProduct)
	}

	return orderProducts, true
}

func DbGetOrderProductsFull(userId int, orderId int) ([]OrderListItemProduct, bool) {
	schema := fmt.Sprint("u", userId)
	var orderProducts []OrderListItemProduct

	statement := fmt.Sprintf(`
	SELECT 
		op.id,
		pp.id as "product_id",
		pp.name as "product_name",
		pt.id as "product_type_id",
		pt.name as "product_type_name",
		sid.description as "description",
		op.unit_price,
		op.amount,
		op.storage_amount
	FROM %v.order_product op
	INNER JOIN %v.storage_item si ON si.id = op.storage_id
	INNER JOIN public.products_product pp ON pp.id = si.product_id
	INNER JOIN public.products_product_type pt ON pt.id = si.product_type_id
	INNER JOIN %v.storage_item_description sid ON sid.id = si.description_id 
	WHERE order_id = $1`, schema, schema, schema)

	rows, err := db.Instance.Db.Query(statement, orderId)

	if err != nil {
		return orderProducts, false
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
			return orderProducts, false
		}

		orderProducts = append(orderProducts, orderProduct)
	}

	return orderProducts, true
}

func DbOrderGetIds(userId int, id int) (OrderIds, bool) {
	schema := fmt.Sprint("u", userId)

	var orderIds OrderIds

	statement := fmt.Sprintf(`
				SELECT o.id as "order", c.id as "client"
				FROM %v.order_order o
				JOIN %v.order_client c ON o.client_id = c.id WHERE o.id = $1`, schema, schema)
	err := db.Instance.Db.
		QueryRow(statement, id).
		Scan(&orderIds.Id, &orderIds.ClientId)
	if err != nil {
		goto Error
	}

	return orderIds, true
Error:
	return orderIds, false
}

func DbDeleteProductsFromOrderId(userId int, orderId int) bool {
	schema := fmt.Sprint("u", userId)

	statement := fmt.Sprintf(`
					DELETE FROM %v.order_product WHERE order_id = $1`, schema)
	_, err := db.Instance.Db.Exec(statement, orderId)
	if err != nil {
		goto Error
	}

	return true
Error:
	return false
}
