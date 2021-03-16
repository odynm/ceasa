package order

import (
	"encoding/json"
	"net/http"
	"strconv"

	"ceasa/loader"
	"ceasa/user"
	"ceasa/utils"
)

func add(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		var orderDto OrderDto
		err := json.NewDecoder(r.Body).Decode(&orderDto)
		if err != nil ||
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
		} else {
			// Failed is dealth with inside the service in this case
		}
	}
}

func get(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		timezone := r.Header.Get("Timezone")
		if len(timezone) > 0 {
			GetForVendor(userId, timezone, w)
		} else {
			utils.Failed(w, -1)
		}
	} else {
		utils.NoAuth(w)
	}
}

func getLoader(w http.ResponseWriter, r *http.Request) {
	loaderId := loader.CheckLogin(w, r)
	if loaderId > 0 {
		userId := loader.GetLoaderUserId(w, r)
		if userId > 0 {
			timezone := r.Header.Get("Timezone")
			if len(timezone) > 0 {
				GetForLoader(userId, timezone, w)
			} else {
				utils.Failed(w, -1)
			}
		} else {
			utils.NoAuth(w)
		}
	} else {
		utils.NoAuth(w)
	}
}

func delete(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		orderStr, ok := r.URL.Query()["id"]
		if ok {
			orderId, err := strconv.ParseInt(orderStr[0], 10, 32)
			if err != nil && orderId == 0 {
				utils.Failed(w, -1)
			} else {
				DeleteOrder(userId, int(orderId), w)
			}
		} else {
			utils.Failed(w, -1)
		}
	} else {
		utils.NoAuth(w)
	}
}

func recreate(w http.ResponseWriter, r *http.Request) {
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
				DeleteOrderDeFacto(userId, orderDto.Id, w)
				orderDto.Id = 0
				result = Add(orderDto, userId, w)
		} else {
			result = Add(orderDto, userId, w)
		}

		if result > 0 {
			utils.Success(w, result)
		} else {
			// Failed is dealth within the service in this case
		}
	}
}

func orderRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		add(w, r)
	case http.MethodGet:
		get(w, r)
	case http.MethodDelete:
		delete(w, r)
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

func orderRecreateRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		recreate(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("/order", orderRouter)
	http.HandleFunc("/order/loader", orderLoaderRouter)
	http.HandleFunc("/order/recreate", orderRecreateRouter)
}
