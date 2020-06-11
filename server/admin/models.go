package admin

type AdminLoginDto struct {
	Login string `json:"login"`
	Pass  string `json:"pass"`
}

type AdminDb struct {
	Id    int
	Login string
	Hash  string
}
