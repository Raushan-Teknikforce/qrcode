// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const qr = require("qrcode");
const fs = require("fs");
const path = require("path");

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadFile("index.html");
  mainWindow.webContents.openDevTools();
}

app.on("ready", createWindow);

ipcMain.on("QrImgRequest", async (event, arg) => {
  try {
    console.log(arg);
    const ImgData = await qr.toDataURL(arg, { type: "png" });
    //console.log(ImgData);
    mainWindow.webContents.send("generatedImg", ImgData);
    // You can also save the image to a file if needed
    fs.writeFile(
      "qr.png",
      ImgData.replace(/^data:image\/png;base64,/, ""),
      "base64",
      (err) => {
        if (err) throw err;
        console.log("The file has been saved!");
      }
    );
  } catch (error) {
    console.error(error);
  }
});
