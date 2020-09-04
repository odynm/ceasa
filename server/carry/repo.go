package carry

import (
	"fmt"

	"../db"
	"../order"
)

func DbStartCarrying(orderId int, userId int, loaderId int) int {
	schema := fmt.Sprint("u", userId)

	var itemId int

	statement := fmt.Sprintf(`
				UPDATE %v."order_order" SET
					loader_id = $1, 
					status = $2
				WHERE id = $3
				RETURNING id`, schema)
	err := db.Instance.Db.
		QueryRow(statement, loaderId, order.S_Carrying, orderId).
		Scan(&itemId)
	if err != nil {
		goto Error
	}

	return itemId
Error:
	return 0
}

func DbFinishCarrying(orderId int, userId int, loaderId int) int {
	schema := fmt.Sprint("u", userId)

	var itemId int

	statement := fmt.Sprintf(`
				UPDATE %v."order_order" SET
					loader_id = $1, 
					status = $2
				WHERE id = $3
				RETURNING id`, schema)
	err := db.Instance.Db.
		QueryRow(statement, loaderId, order.S_Done, orderId).
		Scan(&itemId)
	if err != nil {
		goto Error
	}

	return itemId
Error:
	return 0
}

func DbGetActiveOrders(userId int, loaderId int) ([]order.OrderListItem, bool) {
	schema := fmt.Sprint("u", userId)

	var orderList []order.OrderListItem

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
	WHERE loader_id = $1 AND status = $2
	`, schema, schema)

	rows, err := db.Instance.Db.Query(statement, loaderId, order.S_Carrying)

	if err != nil {
		goto Error
	}

	for rows.Next() {
		var orderItem order.OrderListItem
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

		orderProducts, ok := order.DbGetOrderProductsFull(userId, orderItem.Id)
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

func DbGetStorageIdFromProductOrderId(userId int, productOrderId int) (int, bool) {
	schema := fmt.Sprint("u", userId)

	var storageId int

	statement := fmt.Sprintf(`
				SELECT storage_id
				FROM %v.order_product
				WHERE id = $1`, schema)
	err := db.Instance.Db.
		QueryRow(statement, productOrderId).
		Scan(&storageId)
	if err != nil {
		goto Error
	}

	return storageId, true
Error:
	return storageId, false
}
