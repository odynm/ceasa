package db

import (
	"database/sql"
	"fmt"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "BasketCase94"
	dbname   = "ceasa"
)

type Intc struct {
	Db *sql.DB
}

var Instance Intc

func InitDb() {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)
	sqlDb, err := sql.Open("postgres", psqlInfo)
	Instance = Intc{Db: sqlDb}
	if err != nil {
		panic(err)
	}
	if Instance.Db != nil {
		fmt.Println("Db instance inited")
	}
}
