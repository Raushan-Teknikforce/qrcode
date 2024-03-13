const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  QrImgRequest: (qrData) => {
    ipcRenderer.send("QrImgRequest", qrData);
  },
  generatedImage: (callback) => {
    ipcRenderer.on("generatedImg", callback);
  },
  DataRequest: () => {
    ipcRenderer.send("DataRequest");
  },
  fetchData:(callback)=>{
    ipcRenderer.on("fetchedData", callback);
  }
});

