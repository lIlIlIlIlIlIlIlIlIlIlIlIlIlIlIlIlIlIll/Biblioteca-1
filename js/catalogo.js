const searchInput = document.getElementById("search");
const books = document.querySelectorAll(".book");

searchInput.addEventListener("input", function () {
    let searchText = this.value.toLowerCase();
    books.forEach(book => {
        let title = book.innerText.toLowerCase();
        book.style.display = title.includes(searchText) ? "block" : "none";
    });
});
