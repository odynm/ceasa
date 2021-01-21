# StorageItem, Order

All have Product[]

Product is amount, name, type, etc.

Product can be:

-  MERGED: has name, type, amount (total) AND an items: Product[] with costPrice, amount, etc
-  common: is, itself, a Product only, with name, type, amount, costPrice

They are used all around the app, and is a basis on how the app works for grouping important data together, so that using it is easier for the end-user.

The backend doesn't know this difference, it just knows what a Product is. It's all up to the app to make this interface work.

# Order creation

The order creation now takes into account the productId and productTypeId.
Those are sent to the server, and it is the server responsability to discover which items will be used to fulfill the order, and so ensuring that the storage can fulfill the order.

In offline mode, those needs to be resolved in the app.

# About parent user

    * If a user has a parent, means that it is pointing to another user storage, and so is a child user
    * On the backend, everything works the same: the User property is used to determine the right storage to work on, and a new property coming from frontend named "ChildUser" is used only to log the child in
    * On the frontend, we have now two properties: user and parentUser. Most of the time, only user will be used, but sometimes we check if parentUser && parentUser>0 to know if we are dealing with a child user or a main user

I do realize this is not good at all, and that's why is written here. But it was the obvious way to handle this, since it was not predicted at the project start.

# Future statistics data

Should be on a different folder and completely separated from the rest, to be easier to deal with all this stuff
