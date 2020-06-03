package admin

import (
	"fmt"

	_ "github.com/lib/pq"

	"../db"
)

func dbGetId(login string) int {
	statement := `
		SELECT id FROM "Admin.Info"
		WHERE login = $1`
	id := 0
	err := db.Instance.Db.QueryRow(statement, login).Scan(&id)
	if err != nil {
		return 0
	}
	return id
}

func dbCreateAdmin(login string, hash string) {
	statement := `
		INSERT INTO "Admin.Info" (login, hash)
		VALUES ($1, $2)
		RETURNING id`
	id := 0
	err := db.Instance.Db.QueryRow(statement, login, hash).Scan(&id)
	if err != nil {
		panic(err)
	}
}

func dbCheckLogin(hash string) {
	statement := `
		SELECT id FROM "Admin.Info" 
		WHERE hash = $1`
	id := 0
	err := db.Instance.Db.QueryRow(statement, hash).Scan(&id)
	if err != nil {
		panic(err)
	}
	fmt.Println("Found:", id)
}
