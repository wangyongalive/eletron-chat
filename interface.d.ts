import { CreateChatProps, OnUpdatedCallback } from "./src/types";

export interface IElectronAPI {
  startChat: (data: CreateChatProps) => void;
  onUpdateMessage: (callback: OnUpdatedCallback) => any;
  copyImageToUserDir: (sourcePath: string) => Promise<string>;
  getConfig: () => Promise<AppConfig>;
  updateConfig: (config: Partial<AppConfig>) => Promise<AppConfig>;
  onMenuNewConversation: (callback: () => void) => void;
  onMenuOpenSettings: (callback: () => void) => void;
  showContextMenu: (id: number) => void;
  onDeleteConversation: (callback: (id: number) => void) => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
