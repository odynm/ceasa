package client

import (
	"database/sql"
	"fmt"
	"time"

	"ceasa/db"
)

func DbGetClients(userId int) ([]ClientDto, bool) {
	schema := fmt.Sprint("u", userId)

	var clients []ClientDto

	statement := fmt.Sprintf(`
			SELECT id, key, place, vehicle FROM %v."order_client"
				WHERE last_buy > current_date - interval '30' day
				ORDER BY buys_count 
				LIMIT 50`, schema)

	rows, err := db.Instance.Db.Query(statement)

	if err != nil {
		goto Error
	}

	for rows.Next() {
		var client ClientDto

		err := rows.Scan(&client.Id,
			&client.Key,
			&client.Vehicle,
			&client.Place)

		if err != nil {
			goto Error
		}

		clients = append(clients, client)
	}

	return clients, true

Error:
	return clients, false
}

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
				INSERT INTO %v."order_client" (key, place, vehicle, buys_count, last_buy)
				VALUES ($1, $2, $3, $4, $5)
				RETURNING id`, schema)
		err = db.Instance.Db.QueryRow(statement, clientDto.Key, clientDto.Place, clientDto.Vehicle, 1, time.Now()).Scan(&clientId)
		if err != nil {
			goto Error
		}
	} else if place != clientDto.Place ||
		vehicle != clientDto.Vehicle {
		statement := fmt.Sprintf(`
			UPDATE %v."order_client" 
			SET place = $1, vehicle = $2, buys_count = buys_count + 1, last_buy = $3
			WHERE ID = $4`, schema)
		db.Instance.Db.QueryRow(statement, clientDto.Place, clientDto.Vehicle, time.Now(), clientId)
	}

	return clientId
Error:
	return 0
}

func DbGetClientFromOrder(userId int, orderId int) ClientDto {
	schema := fmt.Sprint("u", userId)
	var client ClientDto

	statement := fmt.Sprintf(`
			SELECT key, place, vehicle 
				FROM %v."order_order" o
				INNER JOIN %v.order_client oc ON oc.id = o.client_id
				WHERE o.id = $1`, schema, schema)
	err := db.Instance.Db.QueryRow(statement).Scan(&client.Key, &client.Place, &client.Vehicle)

	if err != nil && err != sql.ErrNoRows {
		goto Error
	}

	return client
Error:
	return client
}
