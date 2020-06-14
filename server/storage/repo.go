package storage

import (
	"fmt"

	"../db"

	"strings"
)

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
	if err != nil {
		goto Error
	}

	if descriptionId == 0 {
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
		QueryRow(statement, itemDto.Product, itemDto.ProductType, descriptionId, itemDto.Amount).
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
			product_id,
			product_type_id,
			description_id,
			amount
		FROM %v.storage_item
		WHERE id = $1`, schema)

	db.Instance.Db.
		QueryRow(statement, storageId).
		Scan(&storageItem.ProductId, &storageItem.ProductTypeId, &storageItem.DescriptionId, &storageItem.Amount)

	return storageItem
}

func DbGetAllFull(userId int) []StorageItemFull {
	schema := fmt.Sprint("u", userId)

	var storageItems []StorageItemFull

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
		var storageItem StorageItemFull
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
