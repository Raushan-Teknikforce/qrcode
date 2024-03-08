document.addEventListener("DOMContentLoaded", function () {
  let data = document.getElementById("data");
  let generatBtn = document.getElementById("generate");
  generatBtn.addEventListener("click", function () {
    let qrData = data.value;
    data.value = "";
    window.electronAPI.QrImgRequest(qrData);
  });

  window.electronAPI.generatedImage((event, imgData) => {
    // Convert Uint8Array to Blob
    console.log(imgData);
    // const blob = new Blob([imgData], { type: 'image/png' });
    //  const url = URL.createObjectURL(blob);
    // Create an image element and set its source to the data URL
    const img = document.createElement("img");
    img.src = imgData;
    // Append the image element to the document body or any other container
    document.body.appendChild(img);
  });
});
