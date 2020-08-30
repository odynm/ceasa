package carry

import (
	"encoding/json"
	"net/http"

	"../loader"
	"../utils"
)

func startCarrying(w http.ResponseWriter, r *http.Request) {
	loaderId := loader.CheckLogin(w, r)
	if loaderId > 0 {
		userId := loader.GetLoaderUserId(w, r)
		if userId > 0 {
			var orderCarry OrderCarry
			err := json.NewDecoder(r.Body).Decode(&orderCarry)
			if err == nil {
				StartCarrying(orderCarry.Id, userId, loaderId, w)
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

func getAll(w http.ResponseWriter, r *http.Request) {
	loaderId := loader.CheckLogin(w, r)
	if loaderId > 0 {
		userId := loader.GetLoaderUserId(w, r)
		if userId > 0 {
			GetActiveOrders(userId, loaderId, w)
		} else {
			utils.NoAuth(w)
		}
	} else {
		utils.NoAuth(w)
	}
}

func carryRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		getAll(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func carryRouterStart(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		startCarrying(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("/carry", carryRouter)
	http.HandleFunc("/carry/start", carryRouterStart)
}
