package storage

import (
	"database/sql"
	"fmt"

	"ceasa/db"

	"ceasa/utils"
	"strings"
)

func DbIncreaseAmount(id int, increaseAmount int, userId int) bool {
	schema := fmt.Sprint("u", userId)

	statement := fmt.Sprintf(`
		UPDATE %v."storage_item"
		SET amount = amount + $1
		WHERE id = $2`, schema)
	_, err := db.Instance.Db.Exec(statement, increaseAmount, id)
	if err != nil {
		return false
	}
	return true
}

func DbUpdateAmount(id int, amount int, userId int) bool {
	schema := fmt.Sprint("u", userId)

	statement := fmt.Sprintf(`
		UPDATE %v."storage_item"
		SET amount = $1
		WHERE id = $2`, schema)
	_, err := db.Instance.Db.Exec(statement, amount, id)
	if err != nil {
		return false
	}
	return true
}

func DbGetEqualId(idCurrent int, product int, productType int, descriptionId int, costPrice int, userId int) int {
	schema := fmt.Sprint("u", userId)

	var id int

	// Equal that is NOT itself
	statement := fmt.Sprintf(`
		SELECT 
			id
		FROM %v.storage_item
		WHERE 
			deleted = false AND
			product_id = $1 AND
			((product_type_id IS NULL AND $2 = 0) OR product_type_id = $2) AND
			description_id = $3 AND
			cost_price = $4 AND
			id != $5
		`, schema)

	err := db.Instance.Db.
		QueryRow(statement, product, productType, descriptionId, costPrice, idCurrent).
		Scan(&id)

	if err == nil && id > 0 {
		return id
	} else {
		return 0
	}
}

func DbCreateOrGetDescriptionId(description string, userId int) int {
	schema := fmt.Sprint("u", userId)
	description = strings.TrimSpace(description)

	var descriptionId int = 0

	statement := fmt.Sprintf(`
		SELECT id FROM %v."storage_item_description"
		WHERE description = $1`, schema)
	err := db.Instance.Db.QueryRow(statement, description).Scan(&descriptionId)

	if descriptionId == 0 || err != nil {
		statement := fmt.Sprintf(`
			INSERT INTO %v."storage_item_description" (description)
			VALUES ($1)
			RETURNING id`, schema)
		err = db.Instance.Db.QueryRow(statement, description).Scan(&descriptionId)
		if err != nil {
			return 0
		}
	}

	return descriptionId
}

func DbCreateStorageItem(itemDto ItemDto, userId int, descriptionId int) int {
	schema := fmt.Sprint("u", userId)

	var itemId int

	statement := fmt.Sprintf(`
		INSERT INTO %v."storage_item" (product_id, product_type_id, description_id, cost_price, amount)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id`, schema)
	err := db.Instance.Db.
		QueryRow(statement, itemDto.Product, utils.NullIfZero(itemDto.ProductType), descriptionId, itemDto.CostPrice, itemDto.Amount).
		Scan(&itemId)
	if err != nil {
		goto Error
	}

	return itemId
Error:
	return 0
}

func DbUpdateStorageItem(itemDto ItemDto, userId int, descriptionId int) int {
	schema := fmt.Sprint("u", userId)

	var itemId int

	statement := fmt.Sprintf(`
		UPDATE %v."storage_item" SET 
			product_id = $1, 
			product_type_id = $2, 
			description_id = $3, 
			cost_price = $4,
			amount = $5
		WHERE id = $6
		RETURNING id`, schema)
	err := db.Instance.Db.
		QueryRow(statement, itemDto.Product, utils.NullIfZero(itemDto.ProductType), descriptionId, itemDto.CostPrice, itemDto.Amount, itemDto.Id).
		Scan(&itemId)
	if err != nil {
		goto Error
	}

	return itemId
Error:
	return 0
}

func DbGetAllByProductId(productId int, productTypeId int, descriptionId int, userId int) []StorageItem {
	schema := fmt.Sprint("u", userId)

	var storageItems []StorageItem

	statement := fmt.Sprintf(`
		SELECT 
			id,
			product_id,
			product_type_id,
			amount,
			cost_price
		FROM %v.storage_item
		WHERE 
			deleted = false AND
			product_id = $1 AND
			((product_type_id IS NULL AND $2 = 0) OR product_type_id = $2) AND
			description_id = $3`, schema)

	rows, err := db.Instance.Db.
		Query(statement, productId, productTypeId, descriptionId)

	if err != nil {
		goto Error
	}

	for rows.Next() {
		var storageItem StorageItem

		err := rows.Scan(&storageItem.Id, &storageItem.ProductId, &storageItem.ProductTypeId, &storageItem.Amount, &storageItem.CostPrice)

		if err != nil {
			goto Error
		}

		storageItems = append(storageItems, storageItem)
	}

	return storageItems

Error:
	return nil
}

func DbGetAllFull(userId int) []StorageItemFull {
	schema := fmt.Sprint("u", userId)

	var storageItems []StorageItemFull

	statement := fmt.Sprintf(`
	SELECT 
		si.id,
		pp.id as "product_id",
		pp.name as "product_name",
		pt.id as "product_type_id",
		pt.name as "product_type_name",
		sid.id as "description_id",
		sid.description as "description",
		amount,
		cost_price
	FROM %v.storage_item si
	INNER JOIN public.products_product pp ON pp.id = si.product_id
	LEFT JOIN public.products_product_type pt ON pt.id = si.product_type_id
	INNER JOIN %v.storage_item_description sid ON sid.id = si.description_id
	WHERE si.deleted = false`, schema, schema)

	rows, err := db.Instance.Db.Query(statement)

	if err != nil {
		goto Error
	}

	for rows.Next() {
		var storageItem StorageItemFull
		var productTypeId sql.NullInt32
		var productTypeName sql.NullString
		var descriptionId sql.NullInt32
		var description sql.NullString

		err := rows.Scan(&storageItem.Id,
			&storageItem.ProductId,
			&storageItem.ProductName,
			&productTypeId,
			&productTypeName,
			&descriptionId,
			&description,
			&storageItem.Amount,
			&storageItem.CostPrice)

		if err != nil {
			goto Error
		}

		if productTypeId.Valid {
			storageItem.ProductTypeId = int(productTypeId.Int32)
		}
		if productTypeName.Valid {
			storageItem.ProductTypeName = string(productTypeName.String)
		}
		if descriptionId.Valid {
			storageItem.DescriptionId = int(descriptionId.Int32)
		}
		if description.Valid {
			storageItem.Description = string(description.String)
		}

		storageItems = append(storageItems, storageItem)
	}

	return storageItems
Error:
	return nil
}

func DbGetAll(userId int) []StorageItem {
	schema := fmt.Sprint("u", userId)

	var storageItems []StorageItem

	statement := fmt.Sprintf(`
	SELECT 
		id,
		product_id,
		product_type_id,
		description_id,
		cost_price,
		amount
	FROM %v.storage_item si
	WHERE si.deleted = false`, schema)

	rows, err := db.Instance.Db.Query(statement)

	if err != nil {
		goto Error
	}

	for rows.Next() {
		var storageItem StorageItem

		err := rows.Scan(&storageItem.Id,
			&storageItem.ProductId,
			&storageItem.ProductTypeId,
			&storageItem.DescriptionId,
			&storageItem.CostPrice,
			&storageItem.Amount)

		if err != nil {
			goto Error
		}

		storageItems = append(storageItems, storageItem)
	}

	return storageItems
Error:
	return nil
}

func DbDeleteStorage(userId int, storageId int) bool {
	schema := fmt.Sprint("u", userId)

	statement := fmt.Sprintf(`
					UPDATE %v.storage_item SET deleted = true WHERE id = $1`, schema)
	_, err := db.Instance.Db.Exec(statement, storageId)
	if err != nil {
		goto Error
	}

	return true
Error:
	return false
}

func DbDeleteStorageDeFacto(userId int, storageId int) bool {
	schema := fmt.Sprint("u", userId)

	statement := fmt.Sprintf(`
					DELETE FROM %v.storage_item WHERE id = $1`, schema)
	_, err := db.Instance.Db.Exec(statement, storageId)
	if err != nil {
		goto Error
	}

	return true
Error:
	return false
}

func DbResetStorage(userId int) bool {
	schema := fmt.Sprint("u", userId)

	statement := fmt.Sprintf(`
					UPDATE %v.storage_item SET deleted = true`, schema)
	_, err := db.Instance.Db.Exec(statement)
	if err != nil {
		goto Error
	}

	return true
Error:
	return false
}

func DbGetProductAmount(userId int, productId int, productTypeId int, descriptionId int) int {
	var amount int
	schema := fmt.Sprint("u", userId)

	statement := fmt.Sprintf(`
	SELECT SUM(amount)
		FROM %v.storage_item 
		WHERE 
			deleted = false AND
			product_id = $1 AND
			((product_type_id IS NULL AND $2 = 0) OR product_type_id = $2) AND
			description_id = $3`, schema)

	err := db.Instance.Db.
		QueryRow(statement, productId, productTypeId, descriptionId).
		Scan(&amount)

	if err != nil {
		goto Error
	}

	return amount
Error:
	return 0
}

func DbGetProductAmountFromOrder(userId int, orderId int, productId int, productTypeId int, descriptionId int) int {
	var amount int
	schema := fmt.Sprint("u", userId)

	statement := fmt.Sprintf(`
	SELECT SUM(storage_amount)
		FROM %v.order_order o
		LEFT JOIN %v.order_product op ON o.id = op.order_id
		LEFT JOIN %v.storage_item si ON si.id = op.storage_id
		WHERE 
			o.id = $1 AND
			si.deleted = false AND
			product_id = $2 AND
			((product_type_id IS NULL AND $3 = 0) OR product_type_id = $3) AND
			description_id = $4`, schema, schema, schema)

	err := db.Instance.Db.
		QueryRow(statement, orderId, productId, productTypeId, descriptionId).
		Scan(&amount)

	if err != nil {
		goto Error
	}

	return amount
Error:
	return 0
}

func DbGetDescriptionFromId(userId int, descriptionId int) string {
	var description string
	schema := fmt.Sprint("u", userId)

	statement := fmt.Sprintf(`
		SELECT description 
		FROM %v.storage_item_description
		WHERE id = $1`, schema)

	err := db.Instance.Db.
		QueryRow(statement, descriptionId).
		Scan(&description)

	if err != nil {
		goto Error
	}

	return description
Error:
	return ""
}
