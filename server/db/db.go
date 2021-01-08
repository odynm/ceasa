package db

import (
	"database/sql"
	"fmt"
	"os"
	"strings"
	"time"

	"io/ioutil"

	"ceasa/utils"
)

const (
	// host     = "ec2-35-172-73-125.compute-1.amazonaws.com"
	// port     = 5432
	// user     = "tyzbtjggpgfchi"
	// password = "bff6e921a73d4023ce6875f99d50ad7f5667d7f9d6f1d03c4acc5a80eeba4f81"
	// dbname   = "d97jk9l4tj4a7a"

	ctxPublic = 0
	cxtUser   = 1
)

type Intc struct {
	Db *sql.DB
}

var Instance Intc

func InitDb() {
	// psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
	// 	"password=%s dbname=%s sslmode=disable",
	// 	host, port, user, password, dbname)
	// sqlDb, err := sql.Open("postgres", psqlInfo)

	// Take from OS vars
	//databaseUrl := "postgres://tyzbtjggpgfchi:bff6e921a73d4023ce6875f99d50ad7f5667d7f9d6f1d03c4acc5a80eeba4f81@ec2-35-172-73-125.compute-1.amazonaws.com:5432/d97jk9l4tj4a7a"
	databaseUrl := os.Getenv("DATABASE_URL")
	sqlDb, err := sql.Open("postgres", databaseUrl)

	Instance = Intc{Db: sqlDb}
	utils.CrashOnError(err)
	if Instance.Db != nil {
		statement := "SET TIME ZONE 'UTC';"
		_, err := Instance.Db.Exec(statement)
		if err == nil {
			statement := "ALTER DATABASE postgres SET timezone TO 'UTC'; SELECT pg_reload_conf();"
			_, err = Instance.Db.Exec(statement)
			if err == nil {
				fmt.Println("Db instance inited")
			}
		}
	}
}

func updateMigrations(curLastRunned int, contextId int) {
	var err error

	statement := "SELECT id FROM public.migration WHERE context = $1"
	var id int
	err = Instance.Db.QueryRow(statement, contextId).Scan(&id)

	if id > 0 {
		statement = "UPDATE public.migration SET last_id_runned = $1, run_date = $2 WHERE context = $3"
		_, err = Instance.Db.Exec(statement, curLastRunned, time.Now().UTC(), contextId)

	} else {
		statement = "INSERT INTO public.migration (last_id_runned, context, run_date) VALUES($1, $2, $3)"
		_, err = Instance.Db.Exec(statement, curLastRunned, contextId, time.Now().UTC())
	}

	if err != nil {
		fmt.Println("Migration error:")
		fmt.Println(err)
	}
}

func RunMigrationsPublic() {
	fmt.Println(utils.GetPath())
	dir := utils.GetPath() + "/migrations/public"
	_, err := os.Stat(dir)
	utils.CrashOnError(err)

	statement := "SELECT last_id_runned FROM public.migration WHERE context = $1"
	var lastIdRunned int
	Instance.Db.QueryRow(statement, ctxPublic).Scan(&lastIdRunned)

	files, _ := ioutil.ReadDir(dir)

	for i := int(lastIdRunned); i < len(files); i++ {
		path := fmt.Sprint(utils.GetPath(), "/migrations/public/", i+1, ".sql")
		file, err := os.Open(path)
		utils.CrashOnError(err)

		data := make([]byte, 1024*10)
		file.Read(data)
		utils.CrashOnError(err)

		requests := strings.Split(string(data), ";")
		requests = requests[:len(requests)-1]

		Instance.Db.Exec("BEGIN TRANSACTION")
		for _, request := range requests {
			_, err := Instance.Db.Exec(request)
			if err != nil {
				fmt.Println(err)
				Instance.Db.Exec("ROLLBACK TRANSACTION")
				return
			}
		}
		Instance.Db.Exec("COMMIT TRANSACTION")

		updateMigrations(i+1, ctxPublic)
	}
}

func RunMigrationsUsers() {
	dir := utils.GetPath() + "/migrations/user"
	_, err := os.Stat(dir)
	utils.CrashOnError(err)

	statement := "SELECT last_id_runned FROM public.migration WHERE context = $1"
	var lastIdRunned int
	Instance.Db.QueryRow(statement, cxtUser).Scan(&lastIdRunned)

	files, _ := ioutil.ReadDir(dir)

	for i := int(lastIdRunned); i < len(files); i++ {
		path := fmt.Sprint(utils.GetPath(), "/migrations/user/", i+1, ".sql")
		file, err := os.Open(path)
		utils.CrashOnError(err)

		data := make([]byte, 1024*10)
		file.Read(data)
		utils.CrashOnError(err)

		requests := strings.Split(string(data), ";")
		requests = requests[:len(requests)-1]

		Instance.Db.Exec("BEGIN TRANSACTION")
		var userSchemas []string
		statement := "SELECT id FROM public.user_info"
		rows, _ := Instance.Db.Query(statement)
		for rows.Next() {
			var id int
			rows.Scan(&id)
			idStr := fmt.Sprint("u", id)

			userSchemas = append(userSchemas, idStr)
		}

		for _, userSchema := range userSchemas {
			for _, request := range requests {
				requestStr := strings.ReplaceAll(request, "_user_", userSchema)
				_, err := Instance.Db.Exec(requestStr)
				if err != nil {
					fmt.Println(requestStr)
					fmt.Println(err)
					Instance.Db.Exec("ROLLBACK TRANSACTION")
					return
				}
			}
		}
		Instance.Db.Exec("COMMIT TRANSACTION")

		updateMigrations(i+1, cxtUser)
	}
}

func RunMigrationsNewUser(user string) {
	dir := utils.GetPath() + "/migrations/user/"
	_, err := os.Stat(dir)
	utils.CrashOnError(err)

	files, _ := ioutil.ReadDir(dir)

	for i := 0; i < len(files); i++ {
		path := fmt.Sprint(utils.GetPath(), "/migrations/user/", i+1, ".sql")
		file, err := os.Open(path)
		utils.CrashOnError(err)

		data := make([]byte, 1024*10)
		file.Read(data)
		utils.CrashOnError(err)

		requests := strings.Split(string(data), ";")
		requests = requests[:len(requests)-1]

		Instance.Db.Exec("BEGIN TRANSACTION")

		for _, request := range requests {
			requestStr := strings.ReplaceAll(request, "_user_", user)
			_, err := Instance.Db.Exec(requestStr)
			if err != nil {
				fmt.Println(requestStr)
				fmt.Println(err)
				Instance.Db.Exec("ROLLBACK TRANSACTION")
				return
			}
		}
		Instance.Db.Exec("COMMIT TRANSACTION")

		updateMigrations(i+1, cxtUser)
	}
}
