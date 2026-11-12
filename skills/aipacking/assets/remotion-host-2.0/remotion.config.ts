import { Config } from '@remotion/cli/config';
// WebGL light-field backgrounds need a real GL backend in headless Chrome
Config.setChromiumOpenGlRenderer('angle');
Config.setVideoImageFormat('jpeg');
Config.setConcurrency(null);
