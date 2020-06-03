package utils

import "net/http"

type httpError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func InsertError(w http.ResponseWriter, err string) {
	w.WriteHeader(http.StatusBadRequest)
	w.Write([]byte(err))
}
