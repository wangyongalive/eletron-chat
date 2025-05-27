import { app, BrowserWindow, net, protocol } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import "dotenv/config";
import url from "url";
import { configManager } from "./config";
import { createMenu } from "./menu";
import { setupIPC } from "./ipc";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = async () => {
  // 初始化配置
  await configManager.load();

  // 创建浏览器窗口
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    title: "大模型",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // 创建应用程序菜单
  // Create application menu
  createMenu(mainWindow);

  // Setup IPC handlers
  setupIPC(mainWindow);

  // 处理本地文件的安全访问机制;
  protocol.handle("safe-file", async (request) => {
    // 处理本地文件的安全访问机制;
    const filePath = decodeURIComponent(
      request.url.slice("safe-file::\\".length)
    );
    console.log(filePath, "filePath");
    // 将本地文件路径转换为 file:// 格式的 URL
    const newFilePath = url.pathToFileURL(filePath).toString();
    console.log(newFilePath, "newFilePath");
    // 将本地文件路径转换为 file:// 格式的 URL
    return net.fetch(newFilePath);
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    // 加载应用程序的 index.html
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // 打开开发者工具
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
