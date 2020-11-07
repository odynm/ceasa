package test

import (
	"ceasa/client"
	"ceasa/notification"
	"ceasa/order"
	"net/http"
)

func test(w http.ResponseWriter, r *http.Request) {
	data := order.NotificationData{
		Sound: "default",
		Client: client.ClientDto{
			Key:     "Key",
			Place:   "Place",
			Vehicle: "Vehicle",
		},
		Products: []order.OrderListItemProduct{
			order.OrderListItemProduct{
				ProductName:     "Mamão",
				ProductTypeName: "Papaia",
				Description:     "",
				Amount:          10,
				StorageAmount:   10,
			},
			order.OrderListItemProduct{
				ProductName:     "Alface",
				ProductTypeName: "Americana",
				Description:     "Ruins",
				Amount:          10,
				StorageAmount:   10,
			},
			order.OrderListItemProduct{
				ProductName:     "Abóbora",
				ProductTypeName: "",
				Description:     "",
				Amount:          10,
				StorageAmount:   10,
			},
		},
	}

	notification.SendNotification("651614d559f4f48a", "title", "message", data)
}

func testRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		test(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandleRequest() {
	http.HandleFunc("/test", testRouter)
}
