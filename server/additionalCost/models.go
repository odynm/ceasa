package additionalCost

import "time"

type AdditionalCostDTO struct {
	Id          int       `json:"id"`
	CostValue   int       `json:"costValue"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
}
