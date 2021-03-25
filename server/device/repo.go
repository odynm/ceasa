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

func DbGetAllDevicesFromUserId(userId int) []string {
	var hashes []string

	statement := `
		SELECT hash as device FROM public.team_info ti
			LEFT JOIN public.loader_info li ON ti.loader_id = li.id
			LEFT JOIN public.device d ON li.device_id = d.id
		WHERE ti.user_id = $1`

	rows, err := db.Instance.Db.Query(statement, userId)

	if err != nil {
		return hashes
	}

	for rows.Next() {
		var hash string

		err := rows.Scan(&hash)

		if err == nil {
			hashes = append(hashes, hash)
		}
	}

	return hashes
}
