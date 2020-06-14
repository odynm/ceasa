package product

import (
	"bufio"
	"os"
	"strings"

	"../utils"
)

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
