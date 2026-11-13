// ===== Data =====
const takenUsernames = ["admin", "nimali", "kavin"];

// ===== Page elements =====
const form = document.getElementById("signup-form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const dob = document.getElementById("dob");                // Challenge 3
const resetBtn = document.getElementById("reset-btn");    // Challenge 5
const password = document.getElementById("password");
const confirmBox = document.getElementById("confirm");
const terms = document.getElementById("terms");
const showBtn = document.getElementById("show-btn");
const submitBtn = document.getElementById("submit-btn");
const result = document.getElementById("result");
const strengthEl = document.getElementById("strength");   // Challenge 1
const capsMsg = document.getElementById("caps-msg");      // Challenge 2

const ruleItems = {
  length: document.getElementById("rule-length"),
  number: document.getElementById("rule-number"),
  upper: document.getElementById("rule-upper"),
  symbol: document.getElementById("rule-symbol")
};

function showError(input, message) {
  const errorEl = document.getElementById(`${input.id}-error`);
  errorEl.textContent = message;
  input.classList.toggle("invalid", message !== "");
  input.setAttribute("aria-invalid", message !== "");
}

// TODO 1: username rules
function checkUsername(value) {
  if (!/^\w{3,15}$/.test(value)) {
    return "Use 3 to 15 letters, numbers or _.";
  }
  if (takenUsernames.includes(value.toLowerCase())) {
    return "That username is taken. Try another.";
  }
  return "";
}

// TODO 2: email rule
function checkEmail(value) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Enter an email like name@example.com.";
  }
  return "";
}

// TODO 3: password rules (adds or removes the class "met" on each li)
function checkPasswordRules(value) {
  const results = {
    length: value.length >= 8,
    number: /\d/.test(value),
    upper: /[A-Z]/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value)
  };

  let metCount = 0;
  for (const key in results) {
    ruleItems[key].classList.toggle("met", results[key]);
    if (results[key]) metCount++;
  }

  showStrength(value, metCount);
  return metCount === 4;
}

// TODO 4: confirm password
function checkConfirm() {
  if (confirmBox.value === "") return "Please type your password again.";
  if (confirmBox.value !== password.value) return "Passwords do not match.";
  return "";
}

// Challenge 3: date of birth must make the user 16 or over (empty is allowed)
function checkDob(value) {
  if (value === "") return "";
  const [y, m, d] = value.split("-").map(Number);
  const born = new Date(y, m - 1, d);
  if (Number.isNaN(born.getTime())) return "Enter a valid date of birth.";
  const today = new Date();
  if (born > today) return "Date of birth cannot be in the future.";
  let age = today.getFullYear() - y;
  const hadBirthday =
    today.getMonth() > m - 1 ||
    (today.getMonth() === m - 1 && today.getDate() >= d);
  if (!hadBirthday) age--;
  if (age < 16) return "You must be 16 or over to create an account.";
  return "";
}

function updateForm() {
  if (username.value !== "") showError(username, checkUsername(username.value));
  showError(dob, checkDob(dob.value));
  if (email.value !== "") showError(email, checkEmail(email.value));
  if (confirmBox.value !== "") showError(confirmBox, checkConfirm());

  const pwOk = checkPasswordRules(password.value);
  const allOk = checkUsername(username.value) === "" &&
                checkEmail(email.value) === "" &&
                checkDob(dob.value) === "" &&
                pwOk && checkConfirm() === "" && terms.checked;
  submitBtn.disabled = !allOk;
}

[username, email, dob, password, confirmBox, terms].forEach((el) => {
  el.addEventListener("input", updateForm);
});

// TODO 5: Show / Hide the password
showBtn.addEventListener("click", () => {
  const hidden = password.type === "password";
  password.type = hidden ? "text" : "password";
  showBtn.textContent = hidden ? "Hide" : "Show";
});

// Challenge 1: strength word (Weak 0-2 rules, Fair 3, Strong 4)
function showStrength(value, metCount) {
  if (value === "") {
    strengthEl.textContent = "";
    return;
  }
  let word = "Weak";
  if (metCount === 4) word = "Strong";
  else if (metCount === 3) word = "Fair";
  strengthEl.textContent = `Strength: ${word}`;
}

// Challenge 2: Caps Lock warning while typing a password
[password, confirmBox].forEach((box) => {
  box.addEventListener("keydown", (e) => {
    const capsOn = e.getModifierState && e.getModifierState("CapsLock");
    capsMsg.textContent = capsOn ? "Caps Lock is on." : "";
  });
  box.addEventListener("blur", () => {
    capsMsg.textContent = "";
  });
});

// Challenge 4: remember ONLY the username in localStorage (never the password)
const USERNAME_KEY = "signup-username";

username.addEventListener("input", () => {
  try {
    if (checkUsername(username.value) === "") {
      localStorage.setItem(USERNAME_KEY, username.value.trim());
    }
  } catch (err) {
    
  }
});

try {
  const saved = localStorage.getItem(USERNAME_KEY);
  if (saved) {
    username.value = saved;
    updateForm();
  }
} catch (err) {
  
}

// Challenge 5: Start again clears the form, every error and every ticked rule
resetBtn.addEventListener("click", () => {
  form.reset();
  form.hidden = false;
  [username, email, dob, confirmBox].forEach((input) => showError(input, ""));
  capsMsg.textContent = "";
  result.textContent = "";
  password.type = "password";
  showBtn.textContent = "Show";
  try { localStorage.removeItem(USERNAME_KEY); } catch (err) {
    
  }
  updateForm();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  updateForm();
  if (submitBtn.disabled) return;
  result.textContent = `Welcome, ${username.value.trim()}! Your account is ready.`;
  form.hidden = true;
  form.reset();
});