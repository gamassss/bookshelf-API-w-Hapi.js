const books = require("./books")
const { nanoid } = require("nanoid")

const addBookHandler = (request, h) => {
	const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

	const id = nanoid(16)
	let finished = false

	if (pageCount === readPage) {
		finished = true
	}
	if (pageCount < readPage) {
		return h.response({
			"status": "fail",
			"message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
		}).code(400)
	}

	const insertedAt = new Date().toISOString()
	const updatedAt = insertedAt

	if (!name) {
		return h.response({
			"status": "fail",
			"message": "Gagal menambahkan buku. Mohon isi nama buku"
		}).code(400)
	}

	const newObj = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading,
		insertedAt,
		updatedAt
	}

	books.push(newObj)

	const isSuccess = books.filter((book) => book.id === id).length > 0

	if (isSuccess) {
		return h.response({
			"status": "success",
			"message": "Buku berhasil ditambahkan",
			"data": {
				"bookId": id
			}
		}).code(201)
	} else {
		return h.response({
			"status": "error",
			"message": "Buku gagal ditambahkan"
		}).code(500)
	}
}

const getAllBooksHandler = (request, h) => {
	const reading = request.query.reading ?? ""
	const finished = request.query.finished ?? ""
	const name = request.query.name ?? ""

	if (name) {
		const filteredBooks = books.filter(book => book.name.toLowerCase().includes(name.toLowerCase()))
		const booksData = filteredBooks.map(book => ({ id: book.id, name: book.name, publisher: book.publisher }))

		return h.response({
			"status": "success",
			"data": {
				"books": booksData
			}
		}).code(200)
	}

	if (finished === "1") {
		const finishedBooks = books.filter(book => book.readPage === book.pageCount)
		const booksData = finishedBooks.map(book => ({ id: book.id, name: book.name, publisher: book.publisher }))

		return h.response({
			"status": "success",
			"data": {
				"books": booksData
			}
		}).code(200)
	} else if (finished === "0") {
		const unfinishedBooks = books.filter(book => book.readPage < book.pageCount)
		const booksData = unfinishedBooks.map(book => ({ id: book.id, name: book.name, publisher: book.publisher }))

		return h.response({
			"status": "success",
			"data": {
				"books": booksData
			}
		}).code(200)
	}

	if (reading) {
		let status = false
		if (reading === "1") {
			status = true
		}
		const filteredBooks = books.filter(book => book.reading === status)
		const readStatusBooks = filteredBooks.map(book => ({ id: book.id, name: book.name, publisher: book.publisher }))

		return h.response({
			"status": "success",
			"data": {
				"books": readStatusBooks
			}
		}).code(200)
	}

	const showBooks = books.map(book => ({ id: book.id, name: book.name, publisher: book.publisher }))
	return h.response({
		"status": "success",
		"data": {
			"books": showBooks
		}
	}).code(200)
}

const getOneBookByIdHandler = (request, h) => {
	const { id } = request.params

	const isExist = books.filter((book) => book.id === id).length > 0
	const book = books.filter((note) => note.id === id)[0]

	if (isExist) {
		return h.response({
			"status": "success",
			"data": {
				book
			}
		}).code(200)
	} else {
		return h.response({
			"status": "fail",
			"message": "Buku tidak ditemukan"
		}).code(404)
	}
}

const updateBookHandler = (request, h) => {
	const { id } = request.params
	const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

	const updatedAt = new Date().toISOString()

	const index = books.findIndex((book) => book.id === id)

	if (!name) {
		return h.response({
			"status": "fail",
			"message": "Gagal memperbarui buku. Mohon isi nama buku"
		}).code(400)
	}

	if (readPage > pageCount) {
		return h.response({
			"status": "fail",
			"message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
		}).code(400)
	}

	if (index !== -1) {
		books[index] = {
			...books[index],
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			reading,
			updatedAt
		}

		return h.response({
			"status": "success",
			"message": "Buku berhasil diperbarui"
		}).code(200)
	} else {
		return h.response({
			"status": "fail",
			"message": "Gagal memperbarui buku. Id tidak ditemukan"
		}).code(404)
	}
}

const deleteBookHandler = (request, h) => {
	const { id } = request.params
	const index = books.findIndex((book) => book.id === id)

	if (index !== -1) {
		books.splice(index, 1)
		return h.response({
			"status": "success",
			"message": "Buku berhasil dihapus"
		}).code(200)
	} else {
		return h.response({
			"status": "fail",
			"message": "Buku gagal dihapus. Id tidak ditemukan"
		}).code(404)
	}
}

module.exports = {
	addBookHandler,
	getAllBooksHandler,
	getOneBookByIdHandler,
	updateBookHandler,
	deleteBookHandler
}
