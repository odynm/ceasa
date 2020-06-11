package storage

import (
	"fmt"

	"../db"

	"strings"
)

func dbCreateStorageItem(itemDto ItemDto, userId int) int {
	schema := fmt.Sprint("u", userId)
	itemDto.Description = strings.TrimSpace(itemDto.Description)

	var idDescription int
	var idItem int

	statement := fmt.Sprintf(`
		SELECT id FROM %v."storage_item_description"
		WHERE description = $1`, schema)
	err := db.Instance.Db.QueryRow(statement, itemDto.Description).Scan(&idDescription)
	if err != nil {
		goto Error
	}

	if idDescription == 0 {
		statement := fmt.Sprintf(`
			INSERT INTO %v."storage_item_description" (description)
			VALUES ($1)
			RETURNING id`, schema)
		err = db.Instance.Db.QueryRow(statement, itemDto.Description).Scan(&idDescription)
		if err != nil {
			goto Error
		}
	}

	statement = fmt.Sprintf(`
		INSERT INTO %v."storage_item" (product_id, product_type_id, description_id, amount)
		VALUES ($1, $2, $3, $4)
		RETURNING id`, schema)
	err = db.Instance.Db.
		QueryRow(statement, itemDto.Product, itemDto.ProductType, idDescription, itemDto.Amount).
		Scan(&idItem)
	if err != nil {
		goto Error
	}

	return idItem
Error:
	return 0
}

func dbGetStorage(userId int) []StorageItem {
	schema := fmt.Sprint("u", userId)

	var storageItems []StorageItem

	statement := fmt.Sprintf(`
	SELECT 
		id,
		product_id,
		(SELECT name FROM public.products_product WHERE id = product_id) as product_description,
		product_type_id,
		(SELECT name FROM public.products_product_type WHERE id = product_type_id) as product_type_name,
		(SELECT description FROM %v.storage_item_description WHERE id = description_id) as description,
		amount
	FROM %v.storage_item`, schema, schema)

	fmt.Println(statement)
	rows, err := db.Instance.Db.Query(statement)

	if err != nil {
		goto Error
	}

	for rows.Next() {
		var storageItem StorageItem
		err := rows.Scan(&storageItem.Id,
			&storageItem.ProductId,
			&storageItem.ProductName,
			&storageItem.ProductTypeId,
			&storageItem.ProductTypeName,
			&storageItem.Description,
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
