This file should have been created a while ago. I will try to clear some of the app's architecture here:

* About parent user
	* If a user has a parent, means that it is pointing to another user storage, and so is a child user
	* On the backend, everything works the same: the User property is used to determine the right storage to work on, and a new property coming from frontend named "ChildUser" is used only to log the child in
	* On the frontend, we have now two properties: user and parentUser. Most of the time, only user will be used, but sometimes we check if parentUser && parentUser>0 to know if we are dealing with a child user or a main user
I do realize this is not good at all, and that's why is written here. But it was the obvious way to handle this, since it was not predicted at the project start.