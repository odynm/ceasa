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
