const ingredients = ["Dragon Scale", "Phoenix Feather", "Unicorn Horn"];
const generateButton = document.getElementById("generateButton");
const resetButton = document.getElementById("resetButton");
const spellArea = document.getElementById("spellArea");

function getRandomColor() {
  const colors = [
    "#f5e6d3",
    "#e6f0d3",
    "#d3e6f0",
    "#f0d3e6",
    "#e6d3f0",
    "#f0e6d3",
    "#d3f0e6",
    "#f5d3d3",
    "#e8ddd0",
    "#d0e8dd",
    "#ddd0e8",
    "#f0e8d0",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function createSparkles() {
  const sparkleChars = ["✨", "⭐", "💫", "✦", "✧"];
  const rect = spellArea.getBoundingClientRect();

  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.textContent =
      sparkleChars[Math.floor(Math.random() * sparkleChars.length)];

    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;
    const tx = (Math.random() - 0.5) * 100;
    const ty = (Math.random() - 0.5) * 100;

    sparkle.style.left = x + "px";
    sparkle.style.top = y + "px";
    sparkle.style.setProperty("--tx", tx + "px");
    sparkle.style.setProperty("--ty", ty + "px");

    spellArea.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
  }
}

generateButton.addEventListener("click", function () {
  generateButton.disabled = true;

  let count = 3;
  spellArea.innerHTML = `<div class="countdown">${count}</div>`;
  spellArea.style.backgroundColor = "#fdfcfa";

  const countdownInterval = setInterval(() => {
    count--;

    if (count > 0) {
      spellArea.innerHTML = `<div class="countdown">${count}</div>`;
    } else {
      clearInterval(countdownInterval);

      const randomIngredient =
        ingredients[Math.floor(Math.random() * ingredients.length)];
      const randomColor = getRandomColor();

      spellArea.style.backgroundColor = randomColor;
      spellArea.innerHTML = `
                <div class="ingredient-display">${randomIngredient}</div>
                <div class="magic-text">has been summoned!</div>
            `;

      createSparkles();
      generateButton.disabled = false;
    }
  }, 1000);
});

resetButton.addEventListener("click", function () {
  spellArea.innerHTML = "<p>Your spell will appear here...</p>";
  spellArea.style.backgroundColor = "#fdfcfa";
  generateButton.disabled = false;
});
