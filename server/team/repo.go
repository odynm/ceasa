package team

import "ceasa/db"

func DbGetAllTeams(loaderId int) ([]TeamFull, bool) {
	var teams []TeamFull
	statement := `
		SELECT t.id, t.loader_id, t.user_id, l.name, u.login
		FROM "team_info" t
		INNER JOIN "loader_info" l ON l.id = loader_id
		INNER JOIN "user_info" u ON u.id = user_id
		WHERE loader_id = $1`
	rows, err := db.Instance.Db.Query(statement, loaderId)

	if err != nil {
		goto Error
	}

	for rows.Next() {
		var team TeamFull
		err := rows.Scan(&team.Id, &team.LoaderId, &team.UserId, &team.LoaderName, &team.UserName)

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
