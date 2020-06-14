package client

import (
	"database/sql"
	"fmt"

	"../db"
)

func dbCreateOrUpdateClient(clientDto ClientDto, userId int) int {
	schema := fmt.Sprint("u", userId)

	var idClient int
	var place string
	var vehicle string

	statement := fmt.Sprintf(`
			SELECT id, place, vehicle FROM %v."order_client"
			WHERE key = $1`, schema)
	err := db.Instance.Db.QueryRow(statement, clientDto.Key).Scan(&idClient, &place, &vehicle)
	if err != nil && err != sql.ErrNoRows {
		goto Error
	}

	if idClient == 0 {
		statement := fmt.Sprintf(`
				INSERT INTO %v."order_client" (key, place, vehicle)
				VALUES ($1, $2, $3)
				RETURNING id`, schema)
		err = db.Instance.Db.QueryRow(statement, clientDto.Key, clientDto.Place, clientDto.Vehicle).Scan(&idClient)
		if err != nil {
			goto Error
		}
	} else if place != clientDto.Place ||
		vehicle != clientDto.Vehicle {
		statement := fmt.Sprintf(`
			UPDATE %v."order_client" 
			SET place = $1, vehicle = $2
			WHERE ID = $3`, schema)
		db.Instance.Db.QueryRow(statement, clientDto.Place, clientDto.Vehicle, idClient)
	}

	return idClient
Error:
	return 0
}
