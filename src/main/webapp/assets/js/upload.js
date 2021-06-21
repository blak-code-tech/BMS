const dropArea = document.querySelector(".drag-area");
const dragText = dropArea.querySelector("header");

let file;

dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("active");
    dragText.textContent = "Release To Upload File";
});

dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop To Upload File";
});

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    file = e.dataTransfer.files[0];
    let fileType = file.type;
    let validExtensions = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

    if (validExtensions.includes(fileType)) {
        let fileReader = new FileReader();

        fileReader.onload = () => {
            let fileData = fileReader.result;
            if (fileType == "application/vnd.ms-excel") {
                const data = csvToArray(fileData);
                console.log(data);

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
            }

        };

        fileReader.readAsText(file);
    } else {
        console.log("File type " + fileType + "is not supported..");
    }
});

function csvToArray(str, delimiter = ",") {
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
    const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        const el = headers.reduce(function (object, header, index) {

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
}