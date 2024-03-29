package product

import (
	"bufio"
	"net/http"
	"os"
	"strings"

	"ceasa/utils"
)

func AddProduct(userId int, productDto ProductDto, w http.ResponseWriter) {
	response := DbCreateProduct(userId, productDto)
	if response > 0 {
		utils.Success(w, response)
	} else {
		utils.Failed(w, -1)
	}
}

func AddType(userId int, typeDto TypeDto, w http.ResponseWriter) {
	response := DbCreateType(userId, typeDto)
	if response > 0 {
		utils.Success(w, response)
	} else {
		utils.Failed(w, -1)
	}
}

func GetAll(userId int, w http.ResponseWriter) {
	response, ok := DbGetAll(userId)
	if ok {
		utils.Success(w, response)
	} else {
		utils.Failed(w, -1)
	}
}

func GenerateProductTables() {
	path := utils.GetPath() + "/configs/products.config"
	f, err := os.Open(path)
	defer f.Close()
	if err != nil {
		panic(err)
	}
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := scanner.Text()
		hasTypes := strings.Contains(line, "{")
		if hasTypes {
			product := strings.ReplaceAll(line, "{", "")
			product = strings.TrimSpace(product)
			productId := DbAddProduct(product)
			for scanner.Scan() {
				line = scanner.Text()
				if strings.Contains(line, "}") {
					break
				}
				productType := strings.TrimSpace(line)
				DbAddProductType(productId, productType)
			}
		} else {
			product := strings.TrimSpace(line)
			DbAddProduct(product)
		}
	}
}
