package loader

import (
	"net/http"
	"strconv"
	"time"

	"../device"
	"../utils"
)

type LoaderAuthData struct {
	token        string
	creationDate time.Time
}

var tokens = map[int]LoaderAuthData{}

func CreateLoader(createLoader CreateLoaderDto, w http.ResponseWriter) int {
	deviceId, ok := device.CreateDevice(createLoader.Device, w)
	if ok {
		loader := Loader{
			DeviceId: deviceId,
			Name:     createLoader.Name,
		}
		id := DbCreateLoader(loader)
		if id == 0 {
			utils.Failed(w, -1)
		} else {
			return id
		}
	}
	return 0
}

func LoginLoader(loaderDto LoaderDto, w http.ResponseWriter) {
	loader, ok := DbGetLoader(loaderDto)
	if ok {
		token := utils.GetHash(loader.Name + "84" + loaderDto.Device + "D" + time.Now().String())
		tokens[loader.Id] = LoaderAuthData{
			token:        token,
			creationDate: time.Now(),
		}
		response := LoaderResponse{
			Id:    loader.Id,
			Token: token,
		}
		w.Header().Set("Content-Type", "application/json")
		utils.Success(w, response)
	} else {
		utils.Failed(w, -1)
	}
}

func CheckLogin(w http.ResponseWriter, r *http.Request) int {
	loaderStr := r.Header.Get("Loader")
	loaderId, err := strconv.ParseInt(loaderStr, 10, 32)
	auth := r.Header.Get("Auth")
	if err != nil || len(auth) == 0 || loaderId == 0 || tokens[int(loaderId)].token != auth {
		utils.NoAuth(w)
		return 0
	} else {
		return int(loaderId)
	}
}
