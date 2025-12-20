import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.specialists',
  appName: 'specialists-test',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: "http://192.168.0.201:5173",
    cleartext: true,
  }
};

export default config;

