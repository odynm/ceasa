package main

import (
	"fmt"
	"log"
	"net/http"

	"./admin"
	"./db"
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

	handleRequest()
	user.HandleRequest()
	admin.HandleRequest()
	log.Fatal(http.ListenAndServe(":10000", nil))
}
