
const API = "http://localhost:5000/api/products";

let editingId = null;

// Section Navigation
function showSection(section) {
    document.querySelectorAll("main section").forEach(item => {
        item.style.display = "none";
    });

    document.getElementById(section).style.display = "block";

    if (section === "productList" || section === "dashboard") {
        getProducts();
    }

    if (section === "addProduct" && !editingId) {
        document.getElementById("productForm").reset();
        document.getElementById("formTitle").textContent = "Add New Product";
    }
}

// HTML Safety
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Add / Update Product
document.getElementById("productForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", document.getElementById("name").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("category", document.getElementById("category").value);
    formData.append("stock", document.getElementById("stock").value);

    const image = document.getElementById("image").files[0];

    if (image) {
        formData.append("image", image);
    }

    try {
        const url = editingId ? `${API}/${editingId}` : API;
        const method = editingId ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Something went wrong");
        }

        alert(result.message);

        editingId = null;
        e.target.reset();
        document.getElementById("formTitle").textContent = "Add New Product";

        showSection("productList");

    } catch (error) {
        alert(error.message);
    }
});

// Fetch Products
async function getProducts() {
    try {
        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Products fetch nahi ho sake");
        }

        const products = await response.json();

        document.getElementById("totalProducts").textContent = products.length;

        const totalStock = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);

const categories = [...new Set(
    products.map(p => p.category).filter(Boolean)
)];

const inventoryValue = products.reduce(
    (sum, p) => sum + (Number(p.price || 0) * Number(p.stock || 0)), 0
);

document.getElementById("totalStock").textContent = totalStock;
document.getElementById("totalCategories").textContent = categories.length;
document.getElementById("inventoryValue").textContent =
    "Rs. " + inventoryValue.toLocaleString("en-PK");

        const table = document.getElementById("productsTable");

        table.innerHTML = products.map(product => `
            <tr>
                <td>
                    ${product.image
                        ? `<img src="/uploads/${encodeURIComponent(product.image)}" alt="Product">`
                        : "No Image"}
                </td>
                <td>${escapeHTML(product.name)}</td>
                <td>Rs. ${escapeHTML(product.price)}</td>
                <td>${escapeHTML(product.category)}</td>
                <td>${escapeHTML(product.stock)}</td>
                <td>
                    <button data-action="edit" data-id="${product._id}">Edit</button>
                    <button data-action="delete" data-id="${product._id}" style="background:#dc2626">Delete</button>
                </td>
            </tr>
        `).join("");

    } catch (error) {
        alert(error.message);
    }
}

// Edit and Delete Buttons
document.getElementById("productsTable").addEventListener("click", async (e) => {
    const button = e.target.closest("button");

    if (!button) return;

    const id = button.dataset.id;

    if (button.dataset.action === "edit") {
        try {
            const response = await fetch(`${API}/${id}`);
            const product = await response.json();

            if (!response.ok) throw new Error(product.message);

            editingId = id;

            document.getElementById("name").value = product.name;
            document.getElementById("description").value = product.description || "";
            document.getElementById("price").value = product.price;
            document.getElementById("category").value = product.category || "";
            document.getElementById("stock").value = product.stock || 0;
            document.getElementById("image").value = "";

            document.getElementById("formTitle").textContent = "Edit Product";

            showSection("addProduct");

        } catch (error) {
            alert(error.message);
        }
    }

    if (button.dataset.action === "delete") {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await fetch(`${API}/${id}`, {
                method: "DELETE"
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message);

            alert(result.message);
            getProducts();

        } catch (error) {
            alert(error.message);
        }
    }
});

// Load Dashboard
getProducts();
