package main

import (
	"fmt"
	"log"
	"net/http"

	"ceasa/admin"
	"ceasa/carry"
	"ceasa/db"
	"ceasa/loader"
	"ceasa/order"
	"ceasa/product"
	"ceasa/storage"
	"ceasa/team"
	"ceasa/user"
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

	product.GenerateProductTables()

	handleRequest()
	user.HandleRequest()
	admin.HandleRequest()
	storage.HandleRequest()
	order.HandleRequest()
	product.HandleRequest()
	loader.HandleRequest()
	team.HandleRequest()
	carry.HandleRequest()
	log.Fatal(http.ListenAndServe(":10000", nil))
}
