package order

import (
	"encoding/json"
	"net/http"

	"../loader"
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
			(len(orderDto.Products) == 0 && orderDto.ProductListIsDirty == false) {
			utils.BadRequest(w, "Order format is incorrect")
		}

		var result int

		if orderDto.Id > 0 {
			_, ok := GetIds(userId, orderDto.Id, w) //TODO não preciso do client id na edição
			if ok {
				result = Edit(orderDto, userId, w)
			}
		} else {
			result = Add(orderDto, userId, w)
		}

		if result > 0 {
			utils.Success(w, result)
		}
	}
}

func get(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		GetForVendor(userId, w)
	} else {
		utils.Failed(w, -1)
	}
}

func getLoader(w http.ResponseWriter, r *http.Request) {
	loaderId := loader.CheckLogin(w, r)
	if loaderId > 0 {
		userId := loader.GetLoaderUserId(w, r)
		if userId > 0 {
			GetForLoader(userId, w)
		} else {
			utils.NoAuth(w)
		}
	} else {
		utils.NoAuth(w)
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

func orderLoaderRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		getLoader(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("/order", orderRouter)
	http.HandleFunc("/order/loader", orderLoaderRouter)
}
