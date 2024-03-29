package loader

import (
	"net/http"
	"strconv"
	"time"

	"ceasa/device"
	"ceasa/utils"
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

func EditLoader(createLoader CreateLoaderDto, id int, deviceId int, w http.ResponseWriter) int {
	loader := Loader{
		Id:       id,
		DeviceId: deviceId,
		Name:     createLoader.Name,
	}

	returnedId := DbEditLoader(loader)

	if returnedId == 0 {
		utils.Failed(w, -1)
	} else {
		return returnedId
	}

	return 0
}

func LoginLoader(loaderDto LoaderDto, w http.ResponseWriter) {
	loader, ok := DbGetLoader(loaderDto)
	if ok && loader.Id > 0 {
		token := utils.GetHash(loader.Name + "84" + loaderDto.Device + "D" + time.Now().UTC().String())
		tokens[loader.Id] = LoaderAuthData{
			token:        token,
			creationDate: time.Now().UTC(),
		}
		response := LoaderResponse{
			Id:    loader.Id,
			Name:  loader.Name,
			Token: token,
		}

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

func GetLoaderUserId(w http.ResponseWriter, r *http.Request) int {
	userStr := r.Header.Get("User")
	userId, err := strconv.ParseInt(userStr, 10, 32)
	if err != nil || userId == 0 {
		utils.NoAuth(w)
		return 0
	} else {
		return int(userId)
	}
}
