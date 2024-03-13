// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const qr = require("qrcode");
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join("database.sqlite"),
});

const QrCodeImage = sequelize.define("QrCodeImage", {
  data: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

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
 // mainWindow.webContents.openDevTools();
}

app.on("ready", async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync(); // Create the table if it doesn't exist
    createWindow();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});

ipcMain.on("QrImgRequest", async (event, arg) => {
  try {
    console.log(arg);
    const ImgData = await qr.toDataURL(arg, { type: "png" });
    // Save the image data to the database
    const savedQrCodeImage = await QrCodeImage.create({ data: ImgData });
    console.log("QR code image saved to database:", savedQrCodeImage.toJSON());

    mainWindow.webContents.send("generatedImg", ImgData);

    // Save the image to a file if needed
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


ipcMain.on("DataRequest", async (event, arg) => {
    const data =  await QrCodeImage.findAll();
    mainWindow.webContents.send("fetchedData", data);
})

