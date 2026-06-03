function validateLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "password123") {
    window.location.href = "index.html";
  } else {
    document.getElementById("error-modal").style.display = "block";
    console.log("Invalid credentials");
  }
}

function dismissModal() {
  document.getElementById("error-modal").style.display = "none";
}

function toggleNav() {
  const sidebar = document.getElementById("sidebar");

  if (sidebar.style.width === "250px") {
    sidebar.style.width = "0";
    sidebar.style.visibility = "hidden";
  } else {
    sidebar.style.width = "250px";
    sidebar.style.visibility = "visible";
  }
}
