package team

type JoinTeamToken struct {
	Token string `json:"token"`
}

type Team struct {
	Id       int `json:"id"`
	LoaderId int `json:"loaderId"`
	UserId   int `json:"userId"`
}
