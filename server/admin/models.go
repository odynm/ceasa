package admin

import (
	"time"
)

type AdminLoginDto struct {
	Login string `json:"login"`
	Pass  string `json:"password"`
}

type AdminDb struct {
	Id    int
	Login string
	Hash  string
}

type LoginReturn struct {
	Hash string `json:"hash"`
}

type UserPaymentData struct {
	DateDue  time.Time `json:"dateDue"`
	DatePaid time.Time `json:"datePaid"`
}

type CeasaUser struct {
	Id           int               `json:"id"`
	Login        string            `json:"login"`
	LastLogged   time.Time         `json:"lastLogged"`
	Active       bool              `json:"active"`
	CreatedDate  time.Time         `json:"createdDate"`
	DeletedDate  time.Time         `json:"deletedDate"`
	Plan         int               `json:"plan"`
	Permissions  int               `json:"permissions"`
	ParentUserId int               `json:"parentUserId"`
	Payments     []UserPaymentData `json:"payments"`
}

type UserIdInfoDTO struct {
	UserId int `json:"userId"`
}

type ChangePasswordDTO struct {
	UserId   int    `json:"userId"`
	Login    string `json:"login"`
	Password string `json:"password"`
}

type PaymentDb struct {
	Id       int       `json:"id"`
	DateDue  time.Time `json:"dateDue"`
	DatePaid time.Time `json:"datePaid"`
	UserId   int       `json:"userId"`
	AdminId  int       `json:"adminId"`
}
