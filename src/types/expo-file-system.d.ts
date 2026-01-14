declare module "expo-file-system" {
  export const documentDirectory: string | null;
  export const cacheDirectory: string | null;
  export function readAsStringAsync(uri: string, options?: any): Promise<string>;
  export function writeAsStringAsync(uri: string, data: string, options?: any): Promise<void>;
  export function downloadAsync(uri: string, fileUri: string, options?: any): Promise<{ uri: string }>;
  export function getInfoAsync(uri: string): Promise<any>;
  export function deleteAsync(uri: string, options?: any): Promise<void>;
}
