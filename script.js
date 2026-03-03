let startX, startY, endX, endY;
const selectionBox = document.getElementById("selectionBox");
const sheetWrapper = document.querySelector(".sheet-wrapper");

function loadSheet() {
  const url = document.getElementById("sheetURL").value;
  if (!url) {
    alert("Please enter a valid URL");
    return;
  }
  document.getElementById("sheetFrame").src = url;
}

sheetWrapper.addEventListener("touchstart", function(e) {
  const rect = sheetWrapper.getBoundingClientRect();
  startX = e.touches[0].clientX - rect.left;
  startY = e.touches[0].clientY - rect.top;

  selectionBox.style.left = startX + "px";
  selectionBox.style.top = startY + "px";
  selectionBox.style.width = "0px";
  selectionBox.style.height = "0px";
  selectionBox.style.display = "block";
});

sheetWrapper.addEventListener("touchmove", function(e) {
  const rect = sheetWrapper.getBoundingClientRect();
  endX = e.touches[0].clientX - rect.left;
  endY = e.touches[0].clientY - rect.top;

  selectionBox.style.width = Math.abs(endX - startX) + "px";
  selectionBox.style.height = Math.abs(endY - startY) + "px";
  selectionBox.style.left = Math.min(startX, endX) + "px";
  selectionBox.style.top = Math.min(startY, endY) + "px";
});

async function generateImage() {
  if (!selectionBox.style.display) {
    alert("Please select area first");
    return;
  }

  const canvas = await html2canvas(sheetWrapper);
  const ctx = canvas.getContext("2d");

  const x = parseInt(selectionBox.style.left);
  const y = parseInt(selectionBox.style.top);
  const width = parseInt(selectionBox.style.width);
  const height = parseInt(selectionBox.style.height);

  const cropped = document.createElement("canvas");
  cropped.width = width;
  cropped.height = height + 50;

  const croppedCtx = cropped.getContext("2d");

  croppedCtx.fillStyle = "#ffffff";
  croppedCtx.fillRect(0, 0, width, 50);

  const now = new Date();
  const formatted =
    String(now.getDate()).padStart(2, "0") + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    now.getFullYear() + " | " +
    now.toLocaleTimeString();

  croppedCtx.fillStyle = "#000";
  croppedCtx.font = "16px Arial";
  croppedCtx.textAlign = "center";
  croppedCtx.fillText("Receipt Date and Time: " + formatted, width / 2, 30);

  croppedCtx.drawImage(canvas, x, y, width, height, 0, 50, width, height);

  const link = document.createElement("a");
  link.download = "Receipt_" + Date.now() + ".png";
  link.href = cropped.toDataURL();
  link.click();
}
let selectionMode = false;

function toggleSelectMode() {
  selectionMode = !selectionMode;

  const iframe = document.getElementById("sheetFrame");

  if (selectionMode) {
    iframe.style.pointerEvents = "none";
    document.getElementById("selectBtn").innerText = "Disable Selection Mode";
  } else {
    iframe.style.pointerEvents = "auto";
    document.getElementById("selectBtn").innerText = "Enable Selection Mode";
  }
}
