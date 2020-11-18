package client

type ClientDto struct {
	Id      int    `json:"id"`
	Key     string `json:"key"`
	Place   string `json:"place"`
	Vehicle string `json:"vehicle"`
}
