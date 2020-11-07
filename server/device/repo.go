package device

import "ceasa/db"

func DbGetDevice(hash string) int {
	var id int

	statement := `
		SELECT id
		FROM "device"
		WHERE hash = $1`
	err := db.Instance.Db.QueryRow(statement, hash).Scan(&id)
	if err != nil {
		return 0
	}
	return id
}

func DbGetDeviceHashFromLoaderId(loaderId int) string {
	var hash string

	statement := `
	SELECT d.hash 
		FROM loader_info li
		INNER JOIN device d on d.id = li.device_id
		WHERE li.id = $1`
	err := db.Instance.Db.QueryRow(statement, loaderId).Scan(&hash)
	if err != nil {
		return ""
	}
	return hash
}

func DbCreateDevice(hash string) int {
	var id int

	statement := `
		INSERT INTO "device" (hash)
		VALUES ($1)
		RETURNING id`
	err := db.Instance.Db.QueryRow(statement, hash).Scan(&id)
	if err != nil {
		return 0
	}
	return id
}
