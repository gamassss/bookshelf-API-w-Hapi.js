const {
	addBookHandler,
	getAllBooksHandler,
	getOneBookByIdHandler,
	updateBookHandler,
	deleteBookHandler
} = require("./handler")

const routes = [
	{ // handler for add book
		path: "/books",
		method: "POST",
		handler: addBookHandler
	},
	{ // handler for get all books
		path: "/books",
		method: "GET",
		handler: getAllBooksHandler
	},
	{ // handler for get one book by Id
		path: "/books/{id}",
		method: "GET",
		handler: getOneBookByIdHandler
	},
	{ // handler for update book
		path: "/books/{id}",
		method: "PUT",
		handler: updateBookHandler
	},
	{ // handler for delete book
		path: "/books/{id}",
		method: "DELETE",
		handler: deleteBookHandler
	}
]

module.exports = routes
