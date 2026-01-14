// ==============================
// STORAGE
// ==============================
let students = JSON.parse(localStorage.getItem("students")) || [];

// ==============================
// UTILITIES
// ==============================
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

function calculateAge(birthdate) {
    const bday = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - bday.getFullYear();
    const m = today.getMonth() - bday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bday.getDate())) age--;
    return age;
}

// ==============================
// FORM PAGE (index.html)
// ==============================
const form = document.getElementById("studentForm");

if (form) {
    const editIndex = localStorage.getItem("editIndex");

    // LOAD DATA WHEN EDITING
    if (editIndex !== null) {
        const s = students[editIndex];
        document.getElementById("lastName").value = s.lastName;
        document.getElementById("firstName").value = s.firstName;
        document.getElementById("middleName").value = s.middleName;
        document.getElementById("birthdate").value = s.birthdate;
        document.getElementById("course").value = s.course;
        document.getElementById("yearLevel").value = s.yearLevel;
    }

    // ADD / UPDATE STUDENT
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const lastName = document.getElementById("lastName").value.trim();
        const firstName = document.getElementById("firstName").value.trim();
        const middleName = document.getElementById("middleName").value.trim();
        const birthdate = document.getElementById("birthdate").value;
        const course = document.getElementById("course").value;
        const yearLevel = document.getElementById("yearLevel").value;

        if (!lastName || !firstName || !birthdate || !course || !yearLevel) {
            alert("Please complete all required fields.");
            return;
        }

        // 🚫 PREVENT DUPLICATES
        const duplicate = students.some((s, i) =>
            s.firstName.toLowerCase() === firstName.toLowerCase() &&
            s.lastName.toLowerCase() === lastName.toLowerCase() &&
            i != editIndex
        );

        if (duplicate) {
            alert("This student already exists!");
            return;
        }

        const student = {
            id: Date.now(),
            lastName,
            firstName,
            middleName,
            birthdate,
            course,
            yearLevel
        };

        if (editIndex !== null) {
            students[editIndex] = student;
            localStorage.removeItem("editIndex");
        } else {
            students.push(student);
        }

        saveStudents();

        // 👉 REDIRECT TO LIST (LIKE LOGIN)
        window.location.href = "list.html";
    });
}

// ==============================
// LIST PAGE (list.html)
// ==============================
const table = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");

if (table) {
    sortStudents();
    displayStudents();
}

// ==============================
// SORT
// ==============================
function sortStudents() {
    students.sort((a, b) => a.lastName.localeCompare(b.lastName));
}

// ==============================
// DISPLAY
// ==============================
function displayStudents(filter = "") {
    table.innerHTML = "";

    students
        .filter(s =>
            (s.firstName + " " + s.lastName)
                .toLowerCase()
                .includes(filter.toLowerCase())
        )
        .forEach((s, index) => {
            const age = calculateAge(s.birthdate);
            const isMinor = age < 18;

            const row = document.createElement("tr");
            if (isMinor) row.style.background = "#ffe5e5";

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${s.lastName}</td>
                <td>${s.firstName}</td>
                <td>${s.middleName || "-"}</td>
                <td>${s.birthdate}</td>
                <td>${s.course}</td>
                <td>${s.yearLevel}</td>
                <td>
                    <button class="action-btn edit" onclick="editStudent(${index})">Edit</button>
                    <button class="action-btn delete" onclick="deleteStudent(${index})">Delete</button>
                </td>
            `;
            table.appendChild(row);
        });
}

// ==============================
// SEARCH
// ==============================
if (searchInput) {
    searchInput.addEventListener("keyup", function () {
        displayStudents(this.value);
    });
}

// ==============================
// DELETE
// ==============================
function deleteStudent(index) {
    if (confirm("Delete this student?")) {
        students.splice(index, 1);
        saveStudents();
        displayStudents(searchInput ? searchInput.value : "");
    }
}

// ==============================
// EDIT
// ==============================
function editStudent(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "index.html";
}

// ==============================
// EXIT
// ==============================
function exitPage() {
    window.location.href = "index.html";
}




