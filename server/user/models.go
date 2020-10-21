package user

type UserDto struct {
	Login string `json:"login"`
	Pass  string `json:"password"`
}

type UserDb struct {
	Id          int
	Login       string
	Hash        string
	Permissions int
}

type UserResponse struct {
	Id           int    `json:"id"`
	Token        string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

const (
	PNadaaa = 1
)
