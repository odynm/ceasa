package admin

import (
	_ "github.com/lib/pq"

	"../db"
)

func DbGetId(login string) int {
	statement := `
		SELECT id FROM "admin_info"
		WHERE login = $1`
	id := 0
	err := db.Instance.Db.QueryRow(statement, login).Scan(&id)
	if err != nil {
		return 0
	}
	return id
}

func DbCreateAdmin(login string, hash string) int {
	statement := `
		INSERT INTO "admin_info" (login, hash)
		VALUES ($1, $2)
		RETURNING id`
	id := 0
	err := db.Instance.Db.QueryRow(statement, login, hash).Scan(&id)
	if err != nil {
		// just panic, this func is just for dev env
		panic(err)
	}
	return id
}

func DbGetByLogin(login string) AdminDb {
	statement := `
		SELECT hash FROM "admin_info" 
		WHERE login = $1`
	var hash string
	var adminDb AdminDb
	err := db.Instance.Db.QueryRow(statement, login).Scan(&hash)
	if err != nil {
		return adminDb
	}

	adminDb.Hash = hash
	return adminDb
}
