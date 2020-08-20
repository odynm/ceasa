package utils

import (
	"encoding/json"
	"net/http"
)

type ErrorData struct {
	ErrorCode int `json:"errorCode"`
}

type SuccessStruct struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data"`
}

func Success(w http.ResponseWriter, item interface{}) {
	w.Header().Set("Content-Type", "application/json")
	success := SuccessStruct{
		Success: true,
		Data:    item,
	}
	js, _ := json.Marshal(success)
	w.Write(js)
}

func Failed(w http.ResponseWriter, errorCode int) {
	w.Header().Set("Content-Type", "application/json")
	success := SuccessStruct{
		Success: false,
		Data: ErrorData{
			ErrorCode: errorCode,
		},
	}
	js, _ := json.Marshal(success)
	w.Write(js)
}
