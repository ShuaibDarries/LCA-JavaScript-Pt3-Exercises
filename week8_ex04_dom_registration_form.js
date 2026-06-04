document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form elements
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    const usernameError = document.getElementById("usernameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById(
      "confirmPasswordError",
    );
    const formMessage = document.getElementById("formMessage");

    // Clear previous error messages
    usernameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";
    formMessage.textContent = "";

    // Reset border colors
    username.style.borderColor = "";
    email.style.borderColor = "";
    password.style.borderColor = "";
    confirmPassword.style.borderColor = "";

    let isValid = true;

    // Validate Username
    if (username.value.trim() === "") {
      usernameError.textContent = "Username cannot be empty";
      username.style.borderColor = "red";
      isValid = false;
    }

    // Validate Email
    if (email.value.trim() === "") {
      emailError.textContent = "Email cannot be empty";
      email.style.borderColor = "red";
      isValid = false;
    } else if (!email.value.includes("@")) {
      emailError.textContent = 'Email must contain an "@" symbol';
      email.style.borderColor = "red";
      isValid = false;
    }

    // Validate Password
    if (password.value === "") {
      passwordError.textContent = "Password cannot be empty";
      password.style.borderColor = "red";
      isValid = false;
    } else if (password.value.length < 6) {
      passwordError.textContent = "Password must be at least 6 characters long";
      password.style.borderColor = "red";
      isValid = false;
    }

    // Validate Confirm Password
    if (confirmPassword.value === "") {
      confirmPasswordError.textContent = "Confirm Password cannot be empty";
      confirmPassword.style.borderColor = "red";
      isValid = false;
    } else if (confirmPassword.value !== password.value) {
      confirmPasswordError.textContent = "Passwords do not match";
      confirmPassword.style.borderColor = "red";
      isValid = false;
    }

    // If all validations pass
    if (isValid) {
      // Clear all error messages and reset border colors
      usernameError.textContent = "";
      emailError.textContent = "";
      passwordError.textContent = "";
      confirmPasswordError.textContent = "";

      username.style.borderColor = "";
      email.style.borderColor = "";
      password.style.borderColor = "";
      confirmPassword.style.borderColor = "";

      // Display success message
      formMessage.textContent = "Registration successful!";

      // Log collected form data to console
      console.log("Username:", username.value);
      console.log("Email:", email.value);
    }
  });
