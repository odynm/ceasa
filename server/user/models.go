package user

type UserDto struct {
	Login string `json:"login"`
	Pass  string `json:"pass"`
}

type UserDb struct {
	Id          int
	Login       string
	Hash        string
	Permissions int
}

type UserResponse struct {
	Id    int
	Token string
}

const (
	PNadaaa = 1
)
