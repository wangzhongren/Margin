const { app, BrowserWindow, shell } = require("electron");
const path = require("node:path");

const PORT = 31875;
let mainWindow;
let localServer;

async function createWindow() {
  if (!localServer) {
    const { startServer } = await import("../server/index.mjs");
    localServer = startServer({
      port: PORT,
      dataDir: path.join(app.getPath("userData"), "data"),
      serveWeb: true,
    });
  }

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 960,
    minHeight: 680,
    title: "Margin",
    backgroundColor: "#efeeeb",
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 18, y: 20 },
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://") || url.startsWith("http://")) shell.openExternal(url);
    return { action: "deny" };
  });
  await mainWindow.loadURL(`http://127.0.0.1:${PORT}`);
}

app.whenReady().then(createWindow);
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("before-quit", event => {
  if (!localServer) return;
  event.preventDefault();
  const server = localServer;
  localServer = null;
  server.close().finally(() => app.quit());
});
