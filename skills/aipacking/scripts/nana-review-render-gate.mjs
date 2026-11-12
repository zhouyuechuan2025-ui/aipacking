import {requireBoard, requireStyle, productionCheck} from './nana-review.mjs';

if (!(process.argv.length === 3 && process.argv[2] === '--back')) {
  try {
    requireBoard();
    requireStyle();
    productionCheck();
  } catch (e) {
    console.error('渲染未开始：' + e.message);
    process.exit(1);
  }
}
