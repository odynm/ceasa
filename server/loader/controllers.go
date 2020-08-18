package loader

import (
	"encoding/json"
	"net/http"

	"../utils"
)

func create(w http.ResponseWriter, r *http.Request) {
	var createLoaderDto CreateLoaderDto
	err := json.NewDecoder(r.Body).Decode(&createLoaderDto)
	if err != nil || createLoaderDto.Device == "" {
		utils.Failed(w, -1)
	}
	CreateLoader(createLoaderDto, w)
}

func login(w http.ResponseWriter, r *http.Request) {
	var loaderDto LoaderDto
	err := json.NewDecoder(r.Body).Decode(&loaderDto)
	if err != nil || loaderDto.Device == "" {
		utils.NoAuth(w)
	}
	LoginLoader(loaderDto, w)
}

func loaderRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		create(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func loaderLoginRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		login(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("/loader", loaderRouter)
	http.HandleFunc("/loader/login", loaderLoginRouter)
}
