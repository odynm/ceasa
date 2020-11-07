package notification

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

const (
	serverKey = "AAAAs7S-jTg:APA91bHy-Yok6tP3UKhxb_8nVQ6myFPsLh6WscZG7qfDV-hb1GudfDpIdg9QyKyqFgjqfpyU75oaOxtwWZotQ1YO_GzlQnzAexxlqXnzQ72WTA_j5TjP-Tgc6Ey7aHK_la7oxba1P-sz"
)

type Filter struct {
	Field    string `json:"field,omitempty"`
	Key      string `json:"key,omitempty"`
	Relation string `json:"relation,omitempty"`
	Value    string `json:"value,omitempty"`
}

type Text struct {
	En string `json:"en,omitempty"`
	Pt string `json:"pt,omitempty"`
}

type Content struct {
	AppId    string      `json:"app_id,omitempty"`
	Headings Text        `json:"headings,omitempty"`
	Contents Text        `json:"contents,omitempty"`
	Data     interface{} `json:"data,omitempty"`
	Filters  []Filter    `json:"filters,omitempty"`
}

func SendNotification(device string, title string, message string, data interface{}) {
	content := Content{
		AppId:    "19e61978-2e9b-49f8-b19e-20ede4f22986",
		Data:     data,
		Headings: Text{En: title, Pt: title},
		Contents: Text{En: message, Pt: message},
		Filters: []Filter{
			Filter{
				Field:    "tag",
				Key:      device,
				Relation: "=",
				Value:    "true",
			},
		},
	}

	jsonByte, err := json.Marshal(content)

	if err != nil {
		fmt.Print(err)
	}

	request, err := http.NewRequest(
		"POST",
		"https://onesignal.com/api/v1/notifications",
		bytes.NewBuffer(jsonByte),
	)
	request.Header.Set("Authorization", "Basic ZjBiNDAwNGYtMWEyZi00Zjg5LTk2NDQtNTdjMGRjNTA1NGI4")
	request.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	response, err := client.Do(request)

	if err != nil {
		fmt.Print(err)
	}
	response.Body.Close()
}
