package user

import (
	"fmt"
	"time"

	_ "github.com/lib/pq"

	"ceasa/db"
)

func DbGetId(login string) int {
	statement := `
		SELECT id FROM "user_info"
		WHERE login = $1`
	id := 0
	err := db.Instance.Db.QueryRow(statement, login).Scan(&id)
	if err != nil {
		return 0
	}
	return id
}

func DbCreateUser(login string, hash string, permissions int) int {
	statement := `
		INSERT INTO "user_info" (login, hash, last_logged, active, deleted_date, plan, permissions)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id`
	id := 0
	err := db.Instance.Db.QueryRow(statement, login, hash, nil, true, nil, 1, permissions).Scan(&id)
	if err != nil {
		goto Error
	}

	statement = fmt.Sprint("CREATE SCHEMA u", id)
	_, err = db.Instance.Db.Exec(statement)
	if err != nil {
		goto Error
	}

	db.RunMigrationsNewUser(fmt.Sprint("u", id))

	return id
Error:
	return 0
}

func DbGetByLogin(login string) UserDb {
	statement := `
		SELECT id, login, hash, Permissions FROM "user_info" 
		WHERE login = $1 AND active = true`
	var userDb UserDb
	err := db.Instance.Db.QueryRow(statement, login).Scan(&userDb.Id, &userDb.Login, &userDb.Hash, &userDb.Permissions)
	if err != nil {
		fmt.Println(err)
	}
	return userDb
}

func DbSetLogin(id int, refreshToken string) bool {
	statement := `
		UPDATE "user_info" SET  
			refresh_token = $1,
			refresh_token_expiration = $2,
			last_logged = $3
		WHERE id=$4`
	_, err := db.Instance.Db.Exec(statement, refreshToken, time.Now().UTC().Add(time.Hour*24), time.Now().UTC(), id)
	if err != nil {
		return true
	}
	return false
}
