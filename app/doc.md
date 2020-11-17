# StorageItem, Order

All have Product[]

Product is amount, name, type, etc.

Product can be:

MERGED: has name, type, amount (total) AND an items: Product[] with costPrice, amount, etc
common: is, itself, a Product only, with name, type, amount, costPrice

They are used all around the app, and is a basis on how the app works for grouping important data together, so that using it is easier for the end-user.

The backend doesn't know this difference, it just knows what a Product is. It's all up to the app to make this interface work.
