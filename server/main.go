package main

import (
	"fmt"
	"log"
	"net/http"

	"./admin"
	"./db"
	"./storage"
	"./user"
)

func homePage(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	fmt.Fprintf(w, "Welcome to the HomePage")
}

func handleRequest() {
	http.HandleFunc("/", homePage)
}

func main() {
	db.InitDb()
	db.RunMigrationsPublic()
	db.RunMigrationsUsers()

	handleRequest()
	user.HandleRequest()
	admin.HandleRequest()
	storage.HandleRequest()
	log.Fatal(http.ListenAndServe(":10000", nil))
}
