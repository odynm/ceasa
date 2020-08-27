package loader

type LoaderDto struct {
	Device string `json:"device"`
}

type CreateLoaderDto struct {
	Device string `json:"device"`
	Name   string `json:"name"`
}

type Loader struct {
	Id       int    `json:"id"`
	DeviceId int    `json:"deviceId"`
	Name     string `json:"name"`
}

type LoaderResponse struct {
	Id    int    `json:"id"`
	Name  string `json:"name"`
	Token string `json:"accessToken"`
}
