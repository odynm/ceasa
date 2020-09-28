package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"

	"ceasa/admin"
	"ceasa/carry"
	"ceasa/db"
	"ceasa/loader"
	"ceasa/order"
	"ceasa/product"
	"ceasa/storage"
	"ceasa/team"
	"ceasa/user"
	"ceasa/utils"
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

func runPreBuild() {
	// Só rodará se o exe estiver dentro do bin/
	var path string
	strings.Replace("/bin", utils.GetPath(), path, -1)
	fmt.Printf("Trying with %s", path)
	if _, err := os.Stat("../pre-build.sh"); err == nil {
		cmd, err := exec.Command("/bin/sh", "../pre-build.sh").Output()
		if err != nil {
			fmt.Printf("ERROR ON PRE BUILD SCRIPT: %s", err)
		}
		output := string(cmd)
		fmt.Printf(output)
	} else {
		fmt.Printf("Pre-build not found/needed")
	}
}

func main() {
	runPreBuild()
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
