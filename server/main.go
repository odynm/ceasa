package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

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

	portOS := os.Getenv("PORT")
	port := ":10000"
	if portOS != "" {
		port = portOS
	}

	log.Fatal(http.ListenAndServe(port, nil))
}
