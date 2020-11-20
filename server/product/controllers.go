package product

import (
	"encoding/json"
	"net/http"

	"ceasa/user"
	"ceasa/utils"
)

func add(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		var productDto ProductDto
		err := json.NewDecoder(r.Body).Decode(&productDto)
		if err != nil || productDto.Name == "" {
			utils.Failed(w, -1)
		} else {
			AddProduct(userId, productDto, w)
		}
	} else {
		utils.NoAuth(w)
	}
}

func addType(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		var typeDto TypeDto
		err := json.NewDecoder(r.Body).Decode(&typeDto)
		if err != nil || typeDto.Name == "" || typeDto.ProductId == 0 {
			utils.Failed(w, -1)
		} else {
			AddType(userId, typeDto, w)
		}
	} else {
		utils.NoAuth(w)
	}
}

func getAll(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		GetAll(userId, w)
	} else {
		utils.NoAuth(w)
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

func productAddRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		add(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func productAddTypeRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		addType(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("/product/all", productAllRouter)
	http.HandleFunc("/product/add", productAddRouter)
	http.HandleFunc("/product/addType", productAddTypeRouter)
}
