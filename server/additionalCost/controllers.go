package additionalCost

import (
	"encoding/json"
	"net/http"
	"strconv"

	"ceasa/user"
	"ceasa/utils"
)

func post(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		var additionalCost AdditionalCostDTO
		err := json.NewDecoder(r.Body).Decode(&additionalCost)
		if err != nil || additionalCost.CostValue == 0 {
			utils.Failed(w, -1)
			return
		}
		Create(userId, additionalCost, w)
	} else {
		utils.NoAuth(w)
	}
}

func get(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		timezone := r.Header.Get("Timezone")
		if len(timezone) > 0 {
			Get(userId, timezone, w)
		} else {
			utils.Failed(w, -1)
		}
	} else {
		utils.NoAuth(w)
	}
}

func delete(w http.ResponseWriter, r *http.Request) {
	userId := user.CheckLogin(w, r)
	if userId > 0 {
		queryIdStr, ok := r.URL.Query()["id"]
		if ok {
			additionalCostId, err := strconv.ParseInt(queryIdStr[0], 10, 32)
			if err != nil || additionalCostId == 0 {
				utils.Failed(w, -1)
			} else {
				Delete(userId, int(additionalCostId), w)
			}
		} else {
			utils.Failed(w, -1)
		}
	} else {
		utils.NoAuth(w)
	}
}

func additionalCostRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		post(w, r)
	case http.MethodGet:
		get(w, r)
	case http.MethodDelete:
		delete(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("/additional-cost", additionalCostRouter)
}
