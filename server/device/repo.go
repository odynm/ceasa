package device

import "../db"

func DbCreateDevice(hash string) int {
	var id int

	statement := `
		INSERT INTO "device" (hash)
		VALUES ($1)
		RETURNING id`
	err := db.Instance.Db.QueryRow(statement, hash).Scan(&id)
	if err != nil {
		return id
	}
	return 0
}
