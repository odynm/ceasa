package user

import (
	"fmt"
	"net/http"
)

func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the UserPage")
}

func HandleRequest() {
	http.HandleFunc("/user", homePage)
}
