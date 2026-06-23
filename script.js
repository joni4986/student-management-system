let students = JSON.parse(localStorage.getItem("students")) || [];
let editId = null;

const studentForm = document.getElementById("studentForm");
const studentName = document.getElementById("studentName");
const studentSubject = document.getElementById("studentSubject");
const studentGrade = document.getElementById("studentGrade");
const studentTableBody = document.getElementById("studentTableBody");
const searchInput = document.getElementById("searchInput");
const submitButton = document.getElementById("submitButton");

const totalStudents = document.getElementById("totalStudents");
const averageGrade = document.getElementById("averageGrade");
const passedStudents = document.getElementById("passedStudents");
const failedStudents = document.getElementById("failedStudents");
const clearAllBtn = document.getElementById("clearAllBtn");

function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

studentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (editId !== null) {
    students = students.map(function (student) {
      if (student.id === editId) {
        return {
          id: student.id,
          name: studentName.value,
          subject: studentSubject.value,
          grade: Number(studentGrade.value)
        };
      }

      return student;
    });

    editId = null;
    submitButton.textContent = "Add Student";
  } else {
    const student = {
      id: Date.now(),
      name: studentName.value,
      subject: studentSubject.value,
      grade: Number(studentGrade.value)
    };

    students.push(student);
  }

  saveStudents();
  studentForm.reset();
  displayStudents(students);
  updateStats();
});

function displayStudents(studentList) {
  studentTableBody.innerHTML = "";

  studentList.forEach(function (student) {
    const status = student.grade >= 50 ? "Pass" : "Fail";
    const statusClass = student.grade >= 50 ? "pass" : "fail";

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.subject}</td>
      <td>${student.grade}</td>
      <td class="${statusClass}">${status}</td>
      <td>
        <button class="edit-btn" onclick="editStudent(${student.id})">
          Edit
        </button>

        <button class="delete-btn" onclick="deleteStudent(${student.id})">
          Delete
        </button>
      </td>
    `;

    studentTableBody.appendChild(row);
  });
}

function editStudent(id) {
  const student = students.find(function (student) {
    return student.id === id;
  });

  studentName.value = student.name;
  studentSubject.value = student.subject;
  studentGrade.value = student.grade;

  editId = id;
  submitButton.textContent = "Update Student";
}

function deleteStudent(id) {
  students = students.filter(function (student) {
    return student.id !== id;
  });

  saveStudents();
  displayStudents(students);
  updateStats();
}

function updateStats() {
  const total = students.length;

  const passed = students.filter(function (student) {
    return student.grade >= 50;
  }).length;

  const failed = total - passed;

  const average =
    total === 0
      ? 0
      : (
          students.reduce(function (sum, student) {
            return sum + student.grade;
          }, 0) / total
        ).toFixed(1);

  totalStudents.textContent = total;
  averageGrade.textContent = average;
  passedStudents.textContent = passed;
  failedStudents.textContent = failed;
}

searchInput.addEventListener("input", function () {
  const searchText = searchInput.value.toLowerCase();

  const filteredStudents = students.filter(function (student) {
    return student.name.toLowerCase().includes(searchText);
  });

  displayStudents(filteredStudents);
});

clearAllBtn.addEventListener("click", function (){
    students = [];
    saveStudents();
    displayStudents(students);
    updateStats();
});

displayStudents(students);
updateStats();