package loader

import (
	"../db"
)

func DbCreateLoader(loader Loader) int {
	var id int

	statement := `
		INSERT INTO "loader_info" (name, active, device_id)
		VALUES ($1, $2, $3)
		RETURNING id`
	err := db.Instance.Db.QueryRow(statement, loader.Name, true, loader.DeviceId).Scan(&id)
	if err != nil {
		return id
	}
	return 0
}

func DbGetLoader(loaderDto LoaderDto) (Loader, bool) {
	var loader Loader

	statement := `
		SELECT (name, device_id)
		FROM "loader_info"
		WHERE active = true AND device_id = (SELECT id FROM device WHERE hash = $1)`
	result := db.Instance.Db.QueryRow(statement, loaderDto.Device)
	err := result.Scan(&loader.Name, &loader.DeviceId)

	if err != nil {
		return loader, true
	}
	return loader, false
}
