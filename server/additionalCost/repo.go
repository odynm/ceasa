package additionalCost

import (
	"fmt"

	_ "github.com/lib/pq"

	"ceasa/db"
)

func DbCreateAdditionalCost(userId int, additionalCost AdditionalCostDTO) int {
	schema := fmt.Sprint("u", userId)

	statement := fmt.Sprintf(`
		INSERT INTO %v."additional_cost" (cost_value, description, created_at)
		VALUES ($1, $2, $3)
		RETURNING id`, schema)
	id := 0
	err := db.Instance.Db.
		QueryRow(statement, additionalCost.CostValue, additionalCost.Description, additionalCost.CreatedAt).
		Scan(&id)

	if err != nil {
		goto Error
	}

	return id

Error:
	return 0
}

func DbGetAdditionalCosts(userId int, timezone string) []AdditionalCostDTO {
	schema := fmt.Sprint("u", userId)

	var additionalCosts []AdditionalCostDTO

	statement := fmt.Sprintf(`
		SELECT 
			"cost".id,
			"cost".description,
			"cost".cost_value,
			"cost".created_at
		FROM %v.additional_cost AS "cost"
		WHERE (
			date_trunc('day', TIMEZONE($1, NOW()) + interval '1 day') > 
				"cost".created_at AT TIME ZONE 'UTC' AT TIME ZONE $1 AND
			date_trunc('day', TIMEZONE($1, NOW())) <
				"cost".created_at AT TIME ZONE 'UTC' AT TIME ZONE $1
		)
		ORDER BY "cost".id DESC
	`, schema)

	rows, err := db.Instance.Db.Query(statement, timezone)

	if err != nil {
		goto Error
	}

	for rows.Next() {
		var additionalCost AdditionalCostDTO

		err := rows.Scan(&additionalCost.Id,
			&additionalCost.Description,
			&additionalCost.CostValue,
			&additionalCost.CreatedAt,
		)

		if err != nil {
			goto Error
		}

		additionalCosts = append(additionalCosts, additionalCost)
	}

	return additionalCosts
Error:
	return nil
}

func DbDeleteAdditionalCost(userId int, additionalCostId int) bool {
	schema := fmt.Sprint("u", userId)

	statement := fmt.Sprintf(`
					DELETE FROM %v.additional_cost WHERE id = $1`, schema)
	_, err := db.Instance.Db.Exec(statement, additionalCostId)
	if err != nil {
		goto Error
	}

	return true
Error:
	return false
}

func DbGetTotalAdditionalCostForDay(userId int, timezone string) int {
	schema := fmt.Sprint("u", userId)

	var total int

	statement := fmt.Sprintf(`
		SELECT SUM("cost".cost_value)
		FROM %v.additional_cost AS "cost"
		WHERE (
			date_trunc('day', TIMEZONE($1, NOW()) + interval '1 day') > 
				"cost".created_at AT TIME ZONE 'UTC' AT TIME ZONE $1 AND
			date_trunc('day', TIMEZONE($1, NOW())) <
				"cost".created_at AT TIME ZONE 'UTC' AT TIME ZONE $1
		)
	`, schema)

	err := db.Instance.Db.QueryRow(statement, timezone).Scan(&total)

	if err != nil {
		goto Error
	}

	return total
Error:
	return 0
}
