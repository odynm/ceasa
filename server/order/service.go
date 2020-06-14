package order

import (
	"fmt"
	"net/http"

	"../client"
)

func Add(orderDto OrderDto, userId int, w http.ResponseWriter) {
	clientId := client.AddOrUpdateClient(orderDto.Client, userId, w)
	fmt.Println(clientId)
	// TODO product list
	// order := OrderCreation{
	// 	ClientId: clientId,
	// 	Urgent:   orderDto.Urgent,
	// 	Released: orderDto.Released,
	// }
	// dbCreateOrder(order, userId)
}

func Get(userId int, w http.ResponseWriter) {
	// response := dbGetStorage(userId)
	// w.Header().Set("Content-Type", "application/json")
	// js, _ := json.Marshal(response)
	// w.Write(js)
}
