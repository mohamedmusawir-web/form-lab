console.log("Part B: validation ready");

// ===== Page elements =====
const form = document.getElementById("reg-form");
const statusMsg = document.getElementById("status");

// Task B2: validation with JavaScript
// One function per field: returns an error message, or "" when the value is fine
function validateName(value) {
  if (value.trim() === "") return "Please enter your full name.";
  if (value.trim().length < 3) return "Your name must be at least 3 characters.";
  return "";
}

function validateStudentId(value) {
  if (!/^HD\d-\d{3}$/.test(value)) return "Use the format HD3-017.";
  return "";
}

function validateEmail(value) {
  if (value.trim() === "") return "Please enter your email.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Enter an email like name@example.com.";
  }
  return "";
}

function validatePhone(value) {
  if (!/^07\d{8}$/.test(value)) {
    return "Enter 10 digits starting with 07, e.g. 0771234567.";
  }
  return "";
}

function validateWorkshop(value) {
  if (value === "") return "Please choose a workshop.";
  return "";
}

function validateGuests(value) {
  const n = Number(value);
  if (value.trim() === "" || !Number.isInteger(n) || n < 0 || n > 3) {
    return "Guests must be a whole number from 0 to 3.";
  }
  return "";
}

// Task B2: show or clear the error message next to a field
function showError(input, message) {
  const errorEl = document.getElementById(`${input.id}-error`);
  errorEl.textContent = message;
  input.classList.toggle("invalid", message !== "");
  input.setAttribute("aria-invalid", message !== "");
  // Task B3.2 (Challenge): green "valid" border on a touched field with no error
  input.classList.toggle("valid", message === "" && Boolean(input.dataset.touched));
}

// Task B2.2: connect each input id to its validation function
const rules = {
  "full-name": validateName,
  "student-id": validateStudentId,
  "email": validateEmail,
  "phone": validatePhone,
  "workshop": validateWorkshop,
  "guests": validateGuests
};

function checkField(input) {
  const message = rules[input.id](input.value);
  showError(input, message);
  return message === "";
}

// Task B2.2: check every field on submit and focus the first problem
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let firstBad = null;
  for (const id in rules) {
    const input = document.getElementById(id);
    input.dataset.touched = "yes";
    if (!checkField(input) && firstBad === null) firstBad = input;
  }
  if (firstBad) {
    firstBad.focus();
    statusMsg.textContent = "Please fix the errors shown in red.";
    return;
  }
  statusMsg.textContent = "Registration complete!";
  form.reset();
  for (const id in rules) {
    const input = document.getElementById(id);
    delete input.dataset.touched;
    input.classList.remove("valid");
  }
});

// Task B3: live feedback (blur, then input)
// Task B4: accessible errors (aria-describedby links each field to its message)
for (const id in rules) {
  const input = document.getElementById(id);
  input.setAttribute("aria-describedby", `${id}-error`);
  input.addEventListener("blur", () => {
    input.dataset.touched = "yes";
    checkField(input);
  });
  input.addEventListener("input", () => {
    if (input.dataset.touched) checkField(input);
  });
}