package admin

type AdminLoginDto struct {
	Login string `json:"login"`
	Pass  string `json:"password"`
}

type AdminDb struct {
	Id    int
	Login string
	Hash  string
}
