package utils

import (
	"encoding/json"
	"net/http"
)

type SuccessStruct struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data"`
}

func Success(w http.ResponseWriter, item interface{}) {
	success := SuccessStruct{
		Success: true,
		Data:    item,
	}
	js, _ := json.Marshal(success)
	w.Write(js)
}

func Failed(w http.ResponseWriter) {
	success := SuccessStruct{
		Success: false,
	}
	js, _ := json.Marshal(success)
	w.Write(js)
}
