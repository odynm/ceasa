package client

import (
	"database/sql"
	"fmt"

	"ceasa/db"
)

func DbCreateOrUpdateClient(clientDto ClientDto, userId int) int {
	schema := fmt.Sprint("u", userId)

	var clientId int
	var place string
	var vehicle string

	statement := fmt.Sprintf(`
			SELECT id, place, vehicle FROM %v."order_client"
			WHERE key = $1`, schema)
	err := db.Instance.Db.QueryRow(statement, clientDto.Key).Scan(&clientId, &place, &vehicle)
	if err != nil && err != sql.ErrNoRows {
		goto Error
	}

	if clientId == 0 {
		statement := fmt.Sprintf(`
				INSERT INTO %v."order_client" (key, place, vehicle)
				VALUES ($1, $2, $3)
				RETURNING id`, schema)
		err = db.Instance.Db.QueryRow(statement, clientDto.Key, clientDto.Place, clientDto.Vehicle).Scan(&clientId)
		if err != nil {
			goto Error
		}
	} else if place != clientDto.Place ||
		vehicle != clientDto.Vehicle {
		statement := fmt.Sprintf(`
			UPDATE %v."order_client" 
			SET place = $1, vehicle = $2
			WHERE ID = $3`, schema)
		db.Instance.Db.QueryRow(statement, clientDto.Place, clientDto.Vehicle, clientId)
	}

	return clientId
Error:
	return 0
}
