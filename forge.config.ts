import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { VitePlugin } from "@electron-forge/plugin-vite";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";

import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();

const config: ForgeConfig = {
  // 配置打包工具的行为
  packagerConfig: {
    name: "YChat",
    // 启用 ASAR 打包，将应用文件打包为一个单一的存档文件，提升启动速度和安全性
    asar: true,
  },
  // 配置依赖重建的行为
  rebuildConfig: {},

  // 定义不同平台的安装包生成器
  makers: [
    // 为 Windows 平台生成安装包（.exe）
    new MakerSquirrel({
      // 应用信息
      name: "VChat",
      authors: "Viking Zhang",
      description: "A chat application",
      // 安装程序配置
      // setupIcon: "./assets/icon.ico", // Windows 安装图标
      iconUrl:
        "https://raw.githubusercontent.com/your-repo/vchat/main/assets/icon.ico", // 远程图标URL
      // 快捷方式设置
      setupExe: "VChat-Setup.exe", // 安装程序名称
    }),
    // 为 macOS 平台生成压缩包（.zip），排除 darwin 平台
    // new MakerZIP({}, ["darwin"]),
    // 为 Linux 平台生成 RPM 包
    // new MakerRpm({}),
    // 为 Linux 平台生成 DEB 包
    // new MakerDeb({}),
  ],

  // 定义插件配置
  plugins: [
    // 使用 Vite 构建 Electron 应用
    new VitePlugin({
      // 定义多个入口构建，支持主进程、预加载脚本等
      build: [
        {
          // 主进程入口文件
          entry: "src/main.ts",
          // 主进程的 Vite 配置文件
          config: "vite.main.config.ts",
          // 指定目标为主进程
          target: "main",
        },
        {
          // 预加载脚本入口文件
          entry: "src/preload.ts",
          // 预加载脚本的 Vite 配置文件
          config: "vite.preload.config.ts",
          // 指定目标为预加载脚本
          target: "preload",
        },
      ],
      // 定义渲染进程的配置
      renderer: [
        {
          // 渲染进程的名称
          name: "main_window",
          // 渲染进程的 Vite 配置文件
          config: "vite.renderer.config.ts",
        },
      ],
    }),

    // 使用 Fuses 插件启用/禁用 Electron 的某些功能
    new FusesPlugin({
      // 指定 Fuse 版本
      version: FuseVersion.V1,
      // 禁用以 Node.js 模式运行应用
      [FuseV1Options.RunAsNode]: false,
      // 启用 Cookie 加密
      [FuseV1Options.EnableCookieEncryption]: true,
      // 禁用通过环境变量传递 Node.js 参数
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      // 禁用通过命令行参数启用 Node.js 调试
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      // 启用嵌入式 ASAR 文件的完整性验证
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      // 强制从 ASAR 文件中加载应用
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
