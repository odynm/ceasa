package utils

import (
	"crypto/md5"
	"encoding/hex"
)

func GetHash(str string) string {
	byteArr := []byte(str)
	md := md5.Sum(byteArr)
	return hex.EncodeToString(md[:])
}
