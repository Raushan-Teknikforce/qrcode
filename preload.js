const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  QrImgRequest: (qrData) => {
    ipcRenderer.send("QrImgRequest", qrData);
  },
  generatedImage: (callback) => {
    ipcRenderer.on("generatedImg", callback);
  },
});
