package user

import "database/sql"

type UserDto struct {
	Login      string `json:"login"`
	Pass       string `json:"password"`
	ParentUser int    `json:"parentUser"`
}

type UserDb struct {
	Id          int
	Login       string
	Hash        string
	Permissions int
	ParentUser  sql.NullInt32
}

type UserResponse struct {
	Id           int    `json:"id"`
	Token        string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
	ParentUser   int    `json:"parentUser"`
}

const (
	PNadaaa = 1
)
