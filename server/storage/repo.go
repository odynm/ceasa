package storage

import (
	"database/sql"
	"fmt"

	"../db"

	"strings"

	"../utils"
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

func DbCreateStorageItem(itemDto ItemDto, userId int) int {
	schema := fmt.Sprint("u", userId)
	itemDto.Description = strings.TrimSpace(itemDto.Description)

	var descriptionId int
	var itemId int

	statement := fmt.Sprintf(`
		SELECT id FROM %v."storage_item_description"
		WHERE description = $1`, schema)
	err := db.Instance.Db.QueryRow(statement, itemDto.Description).Scan(&descriptionId)

	if descriptionId == 0 || err != nil {
		statement := fmt.Sprintf(`
			INSERT INTO %v."storage_item_description" (description)
			VALUES ($1)
			RETURNING id`, schema)
		err = db.Instance.Db.QueryRow(statement, itemDto.Description).Scan(&descriptionId)
		if err != nil {
			goto Error
		}
	}

	statement = fmt.Sprintf(`
		INSERT INTO %v."storage_item" (product_id, product_type_id, description_id, amount)
		VALUES ($1, $2, $3, $4)
		RETURNING id`, schema)
	err = db.Instance.Db.
		QueryRow(statement, itemDto.Product, utils.NullIfZero(itemDto.ProductType), descriptionId, itemDto.Amount).
		Scan(&itemId)
	if err != nil {
		goto Error
	}

	return itemId
Error:
	return 0
}

func DbGetById(storageId int, userId int) StorageItem {
	schema := fmt.Sprint("u", userId)

	var storageItem StorageItem

	statement := fmt.Sprintf(`
		SELECT 
			id,
			product_id,
			product_type_id,
			description_id,
			amount
		FROM %v.storage_item
		WHERE id = $1`, schema)

	db.Instance.Db.
		QueryRow(statement, storageId).
		Scan(&storageItem.Id, &storageItem.ProductId, &storageItem.ProductTypeId, &storageItem.DescriptionId, &storageItem.Amount)

	return storageItem
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
		sid.description as "description",
		amount
	FROM %v.storage_item si
	INNER JOIN public.products_product pp ON pp.id = si.product_id
	LEFT JOIN public.products_product_type pt ON pt.id = si.product_type_id
	INNER JOIN %v.storage_item_description sid ON sid.id = si.description_id`, schema, schema)

	rows, err := db.Instance.Db.Query(statement)

	if err != nil {
		goto Error
	}

	for rows.Next() {
		var storageItem StorageItemFull
		var productTypeId sql.NullInt32
		var productTypeName sql.NullString
		var description sql.NullString

		err := rows.Scan(&storageItem.Id,
			&storageItem.ProductId,
			&storageItem.ProductName,
			&productTypeId,
			&productTypeName,
			&description,
			&storageItem.Amount)

		if err != nil {
			goto Error
		}

		if productTypeId.Valid {
			storageItem.ProductTypeId = int(productTypeId.Int32)
		}
		if productTypeName.Valid {
			storageItem.ProductTypeName = string(productTypeName.String)
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
		amount
	FROM %v.storage_item`, schema)

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
