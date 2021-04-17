package admin

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"

	"ceasa/db"
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
		SELECT id, hash FROM "admin_info" 
		WHERE login = $1`

	var adminDb AdminDb
	err := db.Instance.Db.QueryRow(statement, login).Scan(&adminDb.Id, &adminDb.Hash)
	if err != nil {
		return adminDb
	}

	return adminDb
}

func DbGetUsers(timezone string) []CeasaUser {
	var users []CeasaUser

	statement := fmt.Sprintf(`
		SELECT 
			u.id, 
			u.login, 
			u.last_logged AT TIME ZONE 'UTC' AT TIME ZONE $1,
			u.active, 
			u.deleted_date AT TIME ZONE 'UTC' AT TIME ZONE $1,
			u.created_date AT TIME ZONE 'UTC' AT TIME ZONE $1,
			u.plan, 
			u.permissions, 
			u.parent_user_id,
			up.date_due,
			up.date_paid
		FROM public.user_info u
		LEFT JOIN 
			user_payment up ON up.user_id = u.id AND
			date_trunc('day', TIMEZONE($1, NOW()) - interval '1 year') < 
						up.date_due AT TIME ZONE 'UTC' AT TIME ZONE $1
		ORDER BY u.id, date_due
	`)

	rows, err := db.Instance.Db.Query(statement, timezone)

	if err != nil {
		goto Error
	}

	// Very clunky extraction of data because of the join with payments
	// and because rows is read-once (buffer)

	// We basicaly iterate through users; when we find a user with payment we keep
	// iterating through that user's rows until there's no more payments left,
	// then we add that user and jump back to the newUser add section

	for rows.Next() {
		var user CeasaUser
		var lastLogged sql.NullTime
		var createdDate sql.NullTime
		var deletedDate sql.NullTime
		var parentId sql.NullInt32

		//vars used for the payment array
		var dateDue sql.NullTime
		var datePaid sql.NullTime
		var payments []UserPaymentData

		err := rows.Scan(&user.Id,
			&user.Login,
			&lastLogged,
			&user.Active,
			&deletedDate,
			&createdDate,
			&user.Plan,
			&user.Permissions,
			&parentId,
			&dateDue,
			&datePaid,
		)

	newUser:
		if err != nil {
			goto Error
		}

		if lastLogged.Valid {
			user.LastLogged = lastLogged.Time
		}
		if deletedDate.Valid {
			user.DeletedDate = deletedDate.Time
		}
		if createdDate.Valid {
			user.CreatedDate = createdDate.Time
		}
		if parentId.Valid {
			user.ParentUserId = int(parentId.Int32)
		}

		// if has payments
		if dateDue.Valid || datePaid.Valid {
			paymentUser := user

			payments = append(payments, UserPaymentData{DateDue: dateDue.Time, DatePaid: datePaid.Time})

			// extract user again.
			// - if is differente, add and go to newUser section
			// - if equal, add to payments
			for rows.Next() {
				err := rows.Scan(&user.Id,
					&user.Login,
					&lastLogged,
					&user.Active,
					&deletedDate,
					&createdDate,
					&user.Plan,
					&user.Permissions,
					&parentId,
					&dateDue,
					&datePaid,
				)

				if err != nil {
					goto Error
				}

				if paymentUser.Id == user.Id {
					payments = append(payments, UserPaymentData{DateDue: dateDue.Time, DatePaid: datePaid.Time})
				} else {
					paymentUser.Payments = payments[0:]
					payments = nil
					users = append(users, paymentUser)
					goto newUser
				}
			}
		}

		users = append(users, user)
	}

	return users
Error:
	return nil
}

func DbGetLastPayment(userId int) PaymentDb {
	statement := `
		SELECT id, date_due, date_paid, user_id, admin_id
		FROM public.user_payment
		WHERE user_id = $1
		ORDER BY date_due DESC 
		LIMIT 1`

	var payment PaymentDb
	db.Instance.Db.
		QueryRow(statement, userId).
		Scan(&payment.Id,
			&payment.DateDue,
			&payment.DatePaid,
			&payment.UserId,
			&payment.AdminId)

	return payment
}

func DbAddPayment(adminId int, userId int, dateStr string) int {
	statement := `
		INSERT INTO "user_payment" (user_id, admin_id, date_due, date_paid)
		VALUES ($1, $2, $3, TIMEZONE('UTC', NOW()))
		RETURNING id`

	id := 0
	err := db.Instance.Db.QueryRow(statement, userId, adminId, dateStr).Scan(&id)

	if err != nil {
		return 0
	}

	return id
}

func DbChangePassword(login string, hash string, adminId int) int {
	var id int

	statement := fmt.Sprintf(`
				UPDATE public."user_info" SET
					hash = $1
				WHERE login = $2
				RETURNING id`)
	err := db.Instance.Db.
		QueryRow(statement, hash, login).
		Scan(&id)
	if err != nil {
		goto Error
	}

	return id
Error:
	return 0
}

func DbGetIsActive(id int) bool {
	statement := `
		SELECT active FROM "user_info" 
		WHERE id = $1`
	var active bool
	err := db.Instance.Db.QueryRow(statement, id).Scan(&active)
	if err != nil {
		fmt.Println(err)
	}
	return active
}

func DbSetUserActive(id int, active bool, adminId int) int {
	var returningId int

	statement := fmt.Sprintf(`
				UPDATE public."user_info" SET
					active = $1
				WHERE id = $2
				RETURNING id`)
	err := db.Instance.Db.
		QueryRow(statement, active, id).
		Scan(&returningId)
	if err != nil {
		goto Error
	}

	return returningId
Error:
	return 0
}

func DbDeleteUser(id int, adminId int) int {
	schema := fmt.Sprint("u", id)

	var returningId int

	statement := fmt.Sprintf(`
		DELETE FROM public.user_payment WHERE user_id = $1
	`)

	_, err := db.Instance.Db.
		Exec(statement, id)
	if err != nil {
		goto Error
	}

	statement = fmt.Sprintf(`
		DELETE FROM public.team_info WHERE user_id = $1
	`)

	_, err = db.Instance.Db.
		Exec(statement, id)
	if err != nil {
		goto Error
	}

	statement = fmt.Sprintf(`
		DELETE FROM public.products_product_type WHERE user_id = $1
	`)

	_, err = db.Instance.Db.
		Exec(statement, id)
	if err != nil {
		goto Error
	}

	statement = fmt.Sprintf(`
		DELETE FROM public.products_product WHERE user_id = $1
	`)

	_, err = db.Instance.Db.
		Exec(statement, id)
	if err != nil {
		goto Error
	}

	statement = fmt.Sprintf(`
		DELETE FROM public."user_info"
			WHERE id = $1
			RETURNING id
	`)

	err = db.Instance.Db.
		QueryRow(statement, id).
		Scan(&returningId)
	if err != nil {
		goto Error
	}

	statement = fmt.Sprintf(`
		DROP SCHEMA IF EXISTS %v CASCADE
	`, schema)

	_, err = db.Instance.Db.
		Exec(statement)
	if err != nil {
		goto Error
	}

	return returningId
Error:
	return 0
}
