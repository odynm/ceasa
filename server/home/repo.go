package home

import (
	"database/sql"
	"fmt"

	"ceasa/db"
)

func DbGetHomeItems(userId int, timezone string) []HomeItem {
	schema := fmt.Sprint("u", userId)

	var homeItems []HomeItem

	statement := fmt.Sprintf(`
	SELECT
		si.id,
		pp.id as "product_id",
		pp.name as "product_name",
		pt.id as "product_type_id",
		pt.name as "product_type_name",
		sid.description as "description",
		amount,
		cost_price,
		order_data.sold,
		order_data.total_earned
	FROM %v.storage_item si
	INNER JOIN public.products_product pp ON pp.id = si.product_id
	LEFT JOIN public.products_product_type pt ON pt.id = si.product_type_id
	INNER JOIN %v.storage_item_description sid ON sid.id = si.description_id
	LEFT JOIN LATERAL (
		SELECT
			SUM(op.amount) AS sold,
			SUM(op.unit_price * op.amount) AS total_earned
		FROM %v.order_order AS o
		INNER JOIN %v.order_product op ON op.order_id = o.id
		WHERE 
			(o.status IN (2,3,4) AND 
			si.id = op.storage_id AND 
			(
				date_trunc('day', TIMEZONE($1, NOW()) + interval '1 day') > 
					o.released_at AT TIME ZONE 'UTC' AT TIME ZONE $1 AND
				date_trunc('day', TIMEZONE($1, NOW())) <
					o.released_at AT TIME ZONE 'UTC' AT TIME ZONE $1)
			)
	) AS order_data ON TRUE
	WHERE si.deleted = false`, schema, schema, schema, schema)

	rows, err := db.Instance.Db.Query(statement, timezone)

	if err != nil {
		goto Error
	}

	for rows.Next() {
		var homeItem HomeItem
		var productTypeId sql.NullInt32
		var productTypeName sql.NullString
		var description sql.NullString
		var sold sql.NullInt32
		var totalEarned sql.NullInt32

		err := rows.Scan(&homeItem.Id,
			&homeItem.ProductId,
			&homeItem.ProductName,
			&productTypeId,
			&productTypeName,
			&description,
			&homeItem.Amount,
			&homeItem.CostPrice,
			&sold,
			&totalEarned)

		if err != nil {
			goto Error
		}

		if productTypeId.Valid {
			homeItem.ProductTypeId = int(productTypeId.Int32)
		}
		if productTypeName.Valid {
			homeItem.ProductTypeName = string(productTypeName.String)
		}
		if description.Valid {
			homeItem.Description = string(description.String)
		}
		if sold.Valid {
			homeItem.Sold = int(sold.Int32)
		}
		if totalEarned.Valid {
			homeItem.TotalEarned = int(totalEarned.Int32)
		}

		homeItems = append(homeItems, homeItem)
	}

	return homeItems
Error:
	return nil
}
