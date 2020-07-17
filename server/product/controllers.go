package product

import (
	"net/http"

	"../user"
)

func add(w http.ResponseWriter, r *http.Request) {

}

func getAll(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		GetAll(userId, w)
	}
}

func productAllRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		getAll(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("/product/all", productAllRouter)
}
