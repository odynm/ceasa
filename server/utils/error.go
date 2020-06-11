package utils

import (
	"io"
	"net/http"
)

type httpError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func InsertError(w http.ResponseWriter, err string) {
	w.WriteHeader(http.StatusBadRequest)
	io.WriteString(w, err)
}

func NoAuth(w http.ResponseWriter) {
	w.WriteHeader(http.StatusUnauthorized)
}

func BadRequest(w http.ResponseWriter, message string) {
	w.WriteHeader(http.StatusBadRequest)
	io.WriteString(w, message)
}

func CrashOnError(err error) {
	if err != nil {
		panic(err)
	}
}
