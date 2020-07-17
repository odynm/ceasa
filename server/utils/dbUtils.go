package utils

import "database/sql"

func NullIfZero(num int) sql.NullInt32 {
	return sql.NullInt32{
		Valid: num > 0,
		Int32: int32(num),
	}
}
