// Task 2: Update Name
document.getElementById("updateNameBtn").addEventListener("click", function () {
  const newName = prompt("Enter new name:");
  if (newName) {
    document.getElementById("profileName").textContent = newName;
  }
});

// Task 2: Update Role
document.getElementById("updateRoleBtn").addEventListener("click", function () {
  const newRole = prompt("Enter new role:");
  if (newRole) {
    document.getElementById("profileRole").textContent = newRole;
  }
});

// Task 3: Toggle Active Status
document
  .getElementById("toggleStatusBtn")
  .addEventListener("click", function () {
    document.getElementById("profileCard").classList.toggle("active-status");
  });

// Task 4: Change Image (Bonus)
document
  .getElementById("changeImageBtn")
  .addEventListener("click", function () {
    const newUrl = prompt("Enter new image URL:");
    if (newUrl) {
      document.getElementById("profileImage").src = newUrl;
    }
  });
