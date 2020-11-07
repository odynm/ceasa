package notification

import (
	"fmt"

	"ceasa/fcm"
)

const (
	serverKey = "AAAAs7S-jTg:APA91bHy-Yok6tP3UKhxb_8nVQ6myFPsLh6WscZG7qfDV-hb1GudfDpIdg9QyKyqFgjqfpyU75oaOxtwWZotQ1YO_GzlQnzAexxlqXnzQ72WTA_j5TjP-Tgc6Ey7aHK_la7oxba1P-sz"
)

func SendNotification(device string, title string, message string, data interface{}) {
	c := fcm.NewFcmClient(serverKey)

	// c.SetNotificationPayload(&fcm.NotificationPayload{
	// 	//Sound: a,
	// 	Title: title,
	// 	Body:  message,
	// })
	c.NewFcmMsgTo("/topics/"+device, data)
	c.SetPriority("high")

	fmt.Print(c.Message.Notification.Sound)
	status, err := c.Send()

	if err == nil {
		status.PrintResults()
	} else {
		fmt.Println(err)
	}
}
