import { app, BrowserWindow, ipcMain } from "electron";
import { CreateChatProps } from "./types";
import { createProvider } from "./providers/createProvider";
import fs from "fs/promises";
import path from "node:path";
import { configManager } from "./config";
import { createContextMenu, updateMenu } from "./menu";

export function setupIPC(mainWindow: BrowserWindow) {
  ipcMain.on("start-chat", async (event, data: CreateChatProps) => {
    const { providerName, messages, messageId, selectedModel } = data;
    try {
      // 创建聊天提供者
      const provider = createProvider(providerName);
      // 开始聊天
      const stream = await provider.chat(messages, selectedModel);
      // 处理聊天流
      for await (const chunk of stream) {
        const content = {
          messageId,
          data: chunk,
        };
        mainWindow.webContents.send("update-message", content);
      }
    } catch (error) {
      // 处理错误
      // console.error("Chat error:", error);
      const errorContent = {
        messageId,
        data: {
          is_end: true,
          result:
            error instanceof Error ? error.message : "与AI服务通信时发生错误",
          is_error: true,
        },
      };
      mainWindow.webContents.send("update-message", errorContent);
    }
  });

  // File handling
  ipcMain.handle(
    // 文件处理
    "copy-image-to-user-dir",
    async (event, sourcePath: string) => {
      const userDataPath = app.getPath("userData");
      const imagesDir = path.join(userDataPath, "images");
      await fs.mkdir(imagesDir, { recursive: true });
      const fileName = path.basename(sourcePath);
      const destPath = path.join(imagesDir, fileName);
      await fs.copyFile(sourcePath, destPath);
      return destPath;
    }
  );

  // Config handlers
  ipcMain.handle("get-config", () => {
    // 配置处理
    return configManager.get();
  });

  ipcMain.handle("update-config", async (event, newConfig) => {
    const updatedConfig = await configManager.update(newConfig);
    // 如果语言发生变化，更新菜单
    if (newConfig.language) {
      updateMenu(mainWindow);
      // 如果语言发生变化，更新菜单
    }
    return updatedConfig;
  });

  // Context menu handler
  ipcMain.on("show-context-menu", (event, id) => {
    // 上下文菜单处理
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return;
    createContextMenu(win, id);
  });
}
