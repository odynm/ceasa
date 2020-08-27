package team

import "../db"

func DbGetAllTeams(loaderId int) ([]Team, bool) {
	var teams []Team
	statement := `
		SELECT id, loaderId, userId
		FROM "team_info"
		WHERE loader_id = $1`
	rows, err := db.Instance.Db.Query(statement, loaderId)

	if err != nil {
		goto Error
	}

	for rows.Next() {
		var team Team
		err := rows.Scan(&team.Id, &team.LoaderId, &team.UserId)

		if err != nil {
			goto Error
		}

		teams = append(teams, team)
	}

	return teams, true

Error:
	return teams, false
}

func DbGetTeam(loaderId int, userId int) int {
	statement := `
		SELECT id
		FROM "team_info"
		WHERE loader_id = $1 AND user_id = $2`
	var id int
	err := db.Instance.Db.QueryRow(statement, loaderId, userId).Scan(&id)
	if err != nil {
		return 0
	}
	return id
}

func DbCreateTeam(loaderId int, userId int) int {
	statement := `
		INSERT INTO "team_info" (loader_id, user_id)
		VALUES ($1, $2)
		RETURNING id`
	var id int
	err := db.Instance.Db.QueryRow(statement, loaderId, userId).Scan(&id)
	if err != nil {
		return 0
	}
	return id
}
