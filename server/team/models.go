package team

type JoinTeamToken struct {
	Token string `json:"token"`
}

type Team struct {
	Id       int `json:"id"`
	LoaderId int `json:"loaderId"`
	UserId   int `json:"userId"`
}

type TeamFull struct {
	Id         int    `json:"id"`
	LoaderId   int    `json:"loaderId"`
	LoaderName string `json:"loaderName"`
	UserId     int    `json:"userId"`
	UserName   string `json:"userName"`
}
