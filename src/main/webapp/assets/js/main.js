var addModal = Vue.component('add-modal', {
    data() {
        return {
            author: "",
            title: "",
            price: 0
        }
    },
    methods: {

        async addBook() {
            var displayResults = $('.overlay-results');
            var book = '{"author": "' + this.author + '","title": "' + this.title + '","price": ' + this.price + '}';
            var myJSON = JSON.parse(book);

            var overlay = $('.overlay-loading');
            var mainForm = $('#getAddBook');
            var form = $('.modalContent');

            overlay.show();
            form.hide();
            var res = await axios.post('http://localhost:8080/BMS/webapi/books/create', myJSON);

            if (res.status == 200) {
                var results = res.data;

                if (results.includes('ALLGOOD')) {
                    // Check if an element currently exists
                    if (!$('#successCheck').length) {
                        var successAlert = '<div id="successCheck" class="alert alert-success alert-dismissible" role="alert">Bank Added Successfully..<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
                        mainForm.before(successAlert);
                    }
                    setTimeout(function() {
                        overlay.hide();
                        displayResults.show();
                    }, 2000);
                } else {
                    // Check if an element currently exists
                    if (!$('#sqlError').length) {
                        var errorAlert = '<div id="sqlError" class="alert alert-danger alert-dismissable" role="alert">' +
                            results +
                            '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
                        mainForm.before(errorAlert);
                    }
                    setTimeout(function() {
                        overlay.hide();
                        form.show();
                    }, 2000);
                }

            } else {
                console.log('error', res);
            }
        },
        reloadPage() {
            var displayResults = $('.overlay-results');
            var form = $('.modalContent');
            // window.location.reload();
            app.allBooks();
            this.author = "";
            this.title = "";
            this.price= 0;
            setTimeout(function() {
                displayResults.hide();
                form.show();
            }, 1000);
        }
    },
    template: `
	<div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="addBook" tabindex="-1"
	aria-labelledby="exampleModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="overlay-loading">
				<div class="d-flex justify-content-center m-5">
					<div class="spinner-grow text-primary" style="width: 5rem; height: 5rem;" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
				</div>
				<p class="text-center lead text-secondary">
					<strong>Processing New Book ...</strong>
				</p>
			</div>
			<div class="overlay-results">
				<div class="text-center">
					<i class="fas fa-check bg-success align-middle text-light p-3 mt-4 mb-2"
						style="font-size: 50px; border-radius: 60px;"></i>
					<p class="lead text-success mb-5">
						<strong>Book Added Successfully...</strong>
					</p>
					<button type="button" class="btn btn-secondary" @click="reloadPage()"
						data-bs-dismiss="modal">Return to
						page</button>
				</div>
			</div>
			<div class="modalContent">
				<div class="modal-header">
					<h5 class="modal-title" id="exampleModalLabel">Book Form</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">

					<form v-on:submit.prevent="addBook">
						<div class="row">

							<div class="form-group">
								<label for="AuthorName">Author's Name</label> <input v-model="author"
									class="form-control" id="Author" required pattern="^[a-zA-Z ]+$"
									title="*Valid characters: Alphabets and space." name="Author"
									placeholder="Enter the author's name" /> <br>
							</div>

							<div class="form-group">
								<label for="Title">Book Title</label> <input v-model="title"
									class="form-control" required id="Title" name="Title"
									placeholder="Enter the book's title" /> <br>
							</div>

							<div class="form-group">
								<label for="Price">Price</label> <input class="form-control"
									v-model.number="price" type="number" step="0.01" required id="Price"
									name="Price" placeholder="Enter the price of the book." /> <br>
							</div>

							<div class="modal-footer">
								<button type="button" class="btn btn-secondary"
									data-bs-dismiss="modal">Close</button>
								<input type="submit" name="addSubmit" class="btn btn-primary"
									value="Add Book" />
							</div>
						</div>
					</form>
				</div>
			</div>

		</div>
	</div>
</div>
	`
});

var uploadModal = Vue.component('upload-modal', {
    methods: {
        onLeave() {
            const dropArea = document.querySelector(".drag-area");
            const dragText = dropArea.querySelector("header");

            dropArea.classList.remove("active");
            dragText.textContent = "Drag & Drop To Upload File";
        },
        onOver() {
            const dropArea = document.querySelector(".drag-area");
            const dragText = dropArea.querySelector("header");

            dropArea.classList.add("active");
            dragText.textContent = "Release To Upload File";
        },
        async onDrop(e) {
            file = e.dataTransfer.files[0];
            this.showFile(file);
        },
        async onSelected(e) {
            const file = document.getElementById('inputBtn').files[0];
            this.showFile(file);
        },
        async showFile(file) {
            let fileType = file.type;
            let validExtensions = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

            if (validExtensions.includes(fileType)) {

                let formData = new FormData();

                formData.append("file", file);

                var displayResults = $('.overlay-results');
                var overlay = $('.overlay-loading');
                var mainForm = $('#getAddBook');
                var form = $('.modalContent');

                overlay.show();
                form.hide();

                var res = await axios.post('http://localhost:8080/BMS/webapi/books/upload',
                    formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                if (res.status == 200) {
                    var results = res.data;

                    if (results.includes('ALLGOOD')) {
                        // Check if an element currently exists
                        if (!$('#successCheck').length) {
                            var successAlert = '<div id="successCheck" class="alert alert-success alert-dismissible" role="alert">Bank Added Successfully..<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
                            mainForm.before(successAlert);
                        }
                        setTimeout(function() {
                            overlay.hide();
                            displayResults.show();
                        }, 2000);
                    } else {
                        // Check if an element currently exists
                        if (!$('#sqlError').length) {
                            var errorAlert = '<div id="sqlError" class="alert alert-danger alert-dismissable" role="alert">' +
                                results +
                                '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
                            mainForm.before(errorAlert);
                        }
                        setTimeout(function() {
                            overlay.hide();
                            form.show();
                        }, 2000);
                    }

                } else {
                    console.log('error', res);
                }
                /*
                let fileReader = new FileReader();
                if (fileType == validExtensions[0]) {
                	fileReader.onload = async () => {
                		let fileData = fileReader.result;

                		const data = this.csvToArray(fileData);

                		var displayResults = $('.overlay-results');
                		var overlay = $('.overlay-loading');
                		var mainForm = $('#getAddBook');
                		var form = $('.modalContent');

                		overlay.show();
                		form.hide();
                		var res = await axios.post('http://localhost:8080/BMSRestApi/webapi/books/upload', data);

                		if (res.status == 200) {
                			var results = res.data;

                			if (results.includes('ALLGOOD')) {
                				// Check if an element currently exists
                				if (!$('#successCheck').length) {
                					var successAlert = '<div id="successCheck" class="alert alert-success alert-dismissible" role="alert">Bank Added Successfully..<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
                					mainForm.before(successAlert);
                				}
                				setTimeout(function () {
                					overlay.hide();
                					displayResults.show();
                				}, 2000);
                			} else {
                				// Check if an element currently exists
                				if (!$('#sqlError').length) {
                					var errorAlert = '<div id="sqlError" class="alert alert-danger alert-dismissable" role="alert">' +
                						results +
                						'<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
                					mainForm.before(errorAlert);
                				}
                				setTimeout(function () {
                					overlay.hide();
                					form.show();
                				}, 2000);
                			}

                		} else {
                			console.log('error', res);
                		}

                	};

                	fileReader.readAsText(file);
                } else if (fileType == validExtensions[1]) {
                	fileReader.readAsBinaryString(file);

                	fileReader.onload = async (e) => {
                		let fileData = e.target.result;
                		let workbook = XLSX.read(fileData, {
                			type: "binary"
                		});
                		let data;
                		workbook.SheetNames.forEach(sheet => {
                			let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
                			data = rowObject;
                		});

                		var displayResults = $('.overlay-results');
                		var overlay = $('.overlay-loading');
                		var mainForm = $('#getAddBook');
                		var form = $('.modalContent');

                		overlay.show();
                		form.hide();
                		var res = await axios.post('http://localhost:8080/BMSRestApi/webapi/books/upload', data);

                		if (res.status == 200) {
                			var results = res.data;

                			if (results.includes('ALLGOOD')) {
                				// Check if an element currently exists
                				if (!$('#successCheck').length) {
                					var successAlert = '<div id="successCheck" class="alert alert-success alert-dismissible" role="alert">Bank Added Successfully..<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
                					mainForm.before(successAlert);
                				}
                				setTimeout(function () {
                					overlay.hide();
                					displayResults.show();
                				}, 2000);
                			} else {
                				// Check if an element currently exists
                				if (!$('#sqlError').length) {
                					var errorAlert = '<div id="sqlError" class="alert alert-danger alert-dismissable" role="alert">' +
                						results +
                						'<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
                					mainForm.before(errorAlert);
                				}
                				setTimeout(function () {
                					overlay.hide();
                					form.show();
                				}, 2000);
                			}


                		} else {
                			console.log('error', res);
                		}
                	};
                }*/
            } else {
                console.log("File type " + fileType + "is not supported..");
            }
        },
        csvToArray(str, delimiter = ",") {
            // slice from start of text to the first \n index
            // use split to create an array from string by delimiter
            const headers = str.slice(0, str.indexOf("\r\n")).split(delimiter);

            // slice from \n index + 1 to the end of the text
            // use split to create an array of each csv value row
            const rows = str.slice(str.indexOf("\n") + 1).split("\r\n");

            // Map the rows
            // split values from each row into an array
            // use headers.reduce to create an object
            // object properties derived from headers:values
            // the object passed as an element of the array
            const arr = rows.map(function(row) {
                const values = row.split(delimiter);
                const el = headers.reduce(function(object, header, index) {

                    if (index == 2) {
                        let price = parseFloat(values[index]);
                        object[header] = price;
                    } else {
                        object[header] = values[index];

                    }
                    return object;
                }, {});
                return el;
            });

            // return the array
            return arr;
        },
        openWindow() {
            const dropArea = document.querySelector(".drag-area");
            let btn = dropArea.querySelector("#inputBtn");
            btn.click();
        },
        reloadPage() {
            var displayResults = $('.overlay-results');
            var form = $('.modalContent');
            // window.location.reload();
            app.allBooks();
            this.author = "";
            this.title = "";
            this.price= 0;
            setTimeout(function() {
                displayResults.hide();
                form.show();
            }, 1000);
        }
    },
    template: `
	<div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="uploadBook" tabindex="-1"
			aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-fullscreen">
				<div class="modal-content">
					<div class="overlay-loading">
						<div class="d-flex justify-content-center m-5">
							<div class="spinner-grow text-primary" style="width: 5rem; height: 5rem;" role="status">
								<span class="visually-hidden">Loading...</span>
							</div>
						</div>
						<p class="text-center lead text-secondary">
							<strong>Processing New Book ...</strong>
						</p>
					</div>
					<div class="overlay-results">
						<div class="text-center">
							<i class="fas fa-check bg-success align-middle text-light p-3 mt-4 mb-2"
								style="font-size: 50px; border-radius: 60px;"></i>
							<p class="lead text-success mb-5">
								<strong>Book Added Successfully...</strong>
							</p>
							<button type="button" class="btn btn-secondary" @click="reloadPage()"
								data-bs-dismiss="modal">Return to
								page</button>
						</div>
					</div>
					<div class="modalContent">
						<div class="modal-header">
							<h5 class="modal-title" id="exampleModalLabel">Upload A File</h5>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="modal-body make-body">
							<div @dragover.prevent="onOver" @dragleave="onLeave" @drop.prevent="onDrop" class="drag-area">
								<div class="icon"><i class="fas fa-cloud-upload-alt"></i></div>
								<header class="text-center">Drag & Drop to Upload File</header>
								<span>OR</span>
								<button @click="openWindow">Browse File</button>
								<input @change="onSelected" accept=".csv,.xls,.xlsx" id="inputBtn" hidden type="file">
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	`
});

var editModal = Vue.component('edit-modal', {
    props: ['eidprop', 'editauthorprop', 'edittitleprop', 'editpriceprop'],
    data: function() {
        return {
            eid: this.eidprop,
            editauthor: this.editauthorprop,
            edittitle: this.edittitleprop,
            editprice: this.editpriceprop
        };
    },
    watch: {
        eidprop: {
            immediate: true,
            handler(newVal, oldVal) {
                this.eid = newVal;
            }
        },
        editauthorprop: {
            immediate: true,
            handler(newVal, oldVal) {
                this.editauthor = newVal;
            }
        },
        edittitleprop: {
            immediate: true,
            handler(newVal, oldVal) {
                this.edittitle = newVal;
            }
        },
        editpriceprop: {
            immediate: true,
            handler(newVal, oldVal) {
                this.editprice = newVal;
            }
        },
    },
    methods: {

        async editBook() {
            var displayResults = $('.overlay-results');
            var book = '{"id": "' + this.eid + '","author": "' + this.editauthor + '","title": "' + this.edittitle + '","price": ' + this.editprice + '}';
            var myJSON = JSON.parse(book);

            var overlay = $('.overlay-loading');
            var form = $('.modalContent');

            overlay.show();
            form.hide();
            const res = await axios.put('http://localhost:8080/BMS/webapi/books/update', myJSON);

            if (res.status == 200) {
                var results = res.data;

                if (results.includes('ALLGOOD')) {
                    setTimeout(function() {
                        overlay.hide();
                        displayResults.show();
                    }, 2000);

                } else {
                    setTimeout(function() {
                        overlay.hide();
                        form.show();
                    }, 2000);
                }

            } else {
                console.log('error', res);
            }
        },
        reloadPage() {
            var displayResults = $('.overlay-results');
            var form = $('.modalContent');
            // window.location.reload();
            app.allBooks();
            setTimeout(function() {
                displayResults.hide();
                form.show();
            }, 1000);
        }
    },
    template: `
	<div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="editBook" tabindex="-1"
	aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="overlay-loading">
			<div class="d-flex justify-content-center m-5">
			<div class="spinner-grow text-primary" style="width: 5rem; height: 5rem;" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>
				<p class="text-center lead text-secondary">
					<strong>Updating Book Details ...</strong>
				</p>
			</div>
			<div class="overlay-results">
				<div class="text-center">
					<i class="fa fa-check bg-success align-middle text-light p-3 mt-4 mb-2"
						style="font-size: 50px; border-radius: 60px;"></i>
					<p class="lead text-success mb-5">
						<strong>Book Updated Successfully...</strong>
					</p>
					<button type="button" class="btn btn-secondary" @click="reloadPage()"
						data-bs-dismiss="modal">Return to
						page</button>
				</div>
			</div>
			<div class="modalContent">
				<div class="modal-header">
					<h5 class="modal-title" id="exampleModalLabel">Edit Book
						Form</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">

					<form v-on:submit.prevent="editBook">
						<input type="hidden" id="eid" v-model.number="eid" name="eid" value="">
						<div class="row">

							<div class="form-group">
								<label for="AuthorName">Author's Name</label> <input class="form-control"
									id="editAuthor" required pattern="^[a-zA-Z ]+$" v-model="editauthor"
									title="*Valid characters: Alphabets and space." name="editAuthor"
									placeholder="Enter the author's name" /> <br>
							</div>

							<div class="form-group">
								<label for="Title">Book Title</label> <input class="form-control"
									v-model="edittitle" required id="editTitle" name="editTitle"
									placeholder="Enter the book's title" /> <br>
							</div>

							<div class="form-group">
								<label for="Price">Price</label> <input class="form-control"
									v-model.number="editprice" type="number" step="0.01" required id="editPrice"
									name="editPrice" placeholder="Enter the price of the book." /> <br>
							</div>

							<div class="modal-footer">
								<button type="button" class="btn btn-secondary"
									data-bs-dismiss="modal">Close</button>
								<input type="submit" name="editSubmit" class="btn btn-primary"
									value="Update Record" />
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
	`
});

var deleteModal = Vue.component('delete-modal', {
    props: ['didprop'],
    data: function() {
        return {
            did: this.didprop,
        }
    },
    watch: {
        didprop: {
            immediate: true,
            handler(newVal, oldVal) {
                this.did = newVal;
            }
        }
    },
    methods: {
        async deleteBook() {
            var overlay = $('.overlay-loading');
            var displayResults = $('.overlay-results');
            var form = $('.modalContent');
            var id = $('#did').val();

            overlay.show();
            form.hide();
            var res = await axios.delete('http://localhost:8080/BMS/webapi/books/delete/' + id);

            if (res.status == 200) {
                var results = res.data;

                if (results.includes('ALLGOOD')) {
                    setTimeout(function() {
                        overlay.hide();
                        displayResults.show();
                    }, 2000);
                } else {
                    setTimeout(function() {
                        overlay.hide();
                        displayResults.show();
                        form.show();
                    }, 2000);
                }
            } else {
                console.log('error', res);
            }
        },
        reloadPage() {
            var displayResults = $('.overlay-results');
            var form = $('.modalContent');
            // window.location.reload();
            app.allBooks();
            setTimeout(function() {
                displayResults.hide();
                form.show();
            }, 1000);
        }

    },
    template: `
	<div class="modal fade" data-bs-backdrop="static" id="deleteBook" tabindex="-1"
			aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="overlay-loading">
						<div class="d-flex justify-content-center m-5">
							<div class="spinner-grow text-primary" style="width: 5rem; height: 5rem;" role="status">
								<span class="visually-hidden">Loading...</span>
							</div>
						</div>
						<p class="text-center lead text-secondary">
							<strong>Cleaning Up ...</strong>
						</p>
					</div>
					<div class="overlay-results">
						<div class="text-center">
							<i class="fa fa-check bg-success align-middle text-light p-3 mt-4 mb-2"
								style="font-size: 50px; border-radius: 60px;"></i>
							<p class="lead text-success mb-5">
								<strong>Book Deleted Successfully...</strong>
							</p>
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="reloadPage()">Return to
								page</button>
						</div>
					</div>
					<div class="modalContent">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title" id="exampleModalLabel">Delete
									Record</h5>
								<button type="button" class="btn-close" data-bs-dismiss="modal"
									aria-label="Close"></button>
							</div>
							<div class="modal-body">
								<form v-on:submit.prevent="deleteBook">
									<input type="hidden" id="did" v-model.number="did" name="did" value="">
									<h5 class="text-danger">Are you sure you want to delete
										this record?</h5>
									<div class="modal-footer">
										<button type="button" class="btn btn-secondary"
											data-bs-dismiss="modal">Close</button>
										<input type="submit" name="deleteSubmit" class="btn btn-danger"
											value="Delete Record" />
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`
});

var navBav = Vue.component('nav-bar', {
    props: ['titleprop'],
    data: function() {
        return {
            title: this.titleprop,
        }
    },
    watch: {
        titleprop: {
            immediate: true,
            handler(newVal, oldVal) {
                this.title = newVal;
            }
        }
    },
    methods: {
        reloadPage() {
            window.location.reload();
        }

    },
    template: `
    <nav class="navbar navbar-expand-lg py-3 sticky-top navbar-dark bg-dark">
    <div class="container-md">
        <a class="navbar-brand" style="cursor: pointer;" @click="reloadPage">{{title}}</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" aria-current="page" href="/BMS">Home</a>
                </li>
                <li class="nav-item">
                    <a aria-current="page" class="nav-link" href="/BMS/logs.html">View Logs</a>
                </li>
                
            </ul>
        </div>
    </div>
</nav>

	`
});

var footBar = Vue.component('footbar', {
    template: `
         <footer class="footer mt-auto py-3 bg-light">
			<div class="container text-center">
				<span class="text-muted">Copyright © Accolm Intern. All Rights Reserved.</span>
			</div>
		</footer>
	`
});

var app = new Vue({
    el: '#app',
    data: {
        appTitle: this.setTitle,
        search: "",
        isFetching: true,
        logs: '',
        did: 0,
        eid: 0,
        editauthor: "",
        edittitle: "",
        editprice: 0,
        books: [],
        currentPage: 1,
        pages: 0,
        itemCount: 0,
        maxPerPage: 10
    },
    components: {
        'add-modal': addModal,
        'edit-modal': editModal,
        'delete-modal': deleteModal,
        'nav-bar': navBav,
        'footbar': footBar
    },
    methods: {
        async allBooks() {

            var start = (this.currentPage - 1) * this.maxPerPage;
            const res = await axios.get('http://localhost:8080/BMS/webapi/books/' + start);
            const resCount = await axios.get('http://localhost:8080/BMS/webapi/books');

            this.isFetching = true;
            if (res.status == 200) {

                if (resCount.status == 200) {
                    this.itemCount = resCount.data;
                    this.pages = Math.ceil(resCount.data / this.maxPerPage);
                }

                this.books = res.data;
                this.isFetching = false;
            } else {
                console.log('error', res);
            }

        },
        async searchBooks(query) {
            var res;
            if (query !== "") {

                if (query.startsWith(" ")) {
                    this.search = "";
                } else {
                    res = await axios.get('http://localhost:8080/BMS/webapi/books/search/' + query);

                    if (res.status == 200) {
                        this.books = res.data;

                    } else {
                        console.log('error', res);
                    }
                }

            } else {
                this.allBooks();
            }
        },
        async fetchBook(id) {

            const res = await axios.get('http://localhost:8080/BMS/webapi/books/get/' + id);

            if (res.status == 200) {
                var results = res.data;

                this.eid = results.id;
                this.editauthor = results.author;
                this.edittitle = results.title;
                this.editprice = results.price;
            } else {
                console.log('error', res);
            }
        },
        setDid(id) {
            this.did = id;
        },
        async getLogs() {
            const res = await axios.get('http://localhost:8080/BMS/webapi/books/logs');

            if (res.status == 200) {
                var results = res.data;

                this.logs = results;
            } else {
                console.log('error', res);
            }
        },
        setPage(id) {

            if (id == 0) {
                this.currentPage++;
            } else if (id == -2) {
                this.currentPage--;
            } else if (id == -1) {
                this.currentPage = this.pages;
            } else if (id == -3) {
                this.currentPage = 1;
            } else {
                this.currentPage = id;
            }
            this.allBooks();
        },
        reloadPage() {
            window.location.reload();
        }

    },
    computed: {
        // a computed getter
        showPrev: function() {
            // `this` points to the vm instance
            if (this.currentPage > 1) {
                return false;
            }

            return true;
        },
        showFirst: function() {
            // `this` points to the vm instance
            if (this.currentPage > 2) {
                return false;
            }

            return true;
        },
        showLast: function() {
            // `this` points to the vm instance
            if (this.pages != this.currentPage) {
                return false;
            }

            return true;
        },
        showNext: function() {
            // `this` points to the vm instance
            if (this.currentPage == this.pages) {
                return true;
            }

            return false;
        },
        setTitle: function() {
            // `this` points to the vm instance
            const client = {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            };
            var title;
            if (client.width < 768) {
                title = 'B.M.S';
            } else {
                title = 'Book Management System';
            }

            return title;
        }
    },
    beforeMount: function() {
        this.appTitle = this.setTitle;
        this.allBooks();
        //this.getLogs();
    }

});