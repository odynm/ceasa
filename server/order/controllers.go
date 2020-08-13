package order

import (
	"encoding/json"
	"net/http"

	"../user"
	"../utils"
)

func add(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		var orderDto OrderDto
		err := json.NewDecoder(r.Body).Decode(&orderDto)
		if err != nil ||
			orderDto.Client.Key == "" ||
			orderDto.Products == nil ||
			len(orderDto.Products) == 0 {
			utils.BadRequest(w, "Order format is incorrect")
		}

		result := Add(orderDto, userId, w)
		if result > 0 {
			utils.Success(w, result)
		}
	}
}

func get(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		GetForVendor(userId, w)
		// TODO get for loader
	}
}

func orderRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		add(w, r)
	case http.MethodGet:
		get(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("/order", orderRouter)
}
