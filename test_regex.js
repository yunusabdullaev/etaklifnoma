const fs = require('fs');
const file = 'client/src/components/Step3Content.jsx';
let content = fs.readFileSync(file, 'utf8');
function getBlock(regexStr) {
  const match = content.match(new RegExp(regexStr, 's'));
  return match ? !!match[1] : false;
}
console.log('langToggles:', getBlock('<div className="space-y-2">\\s*{\\[[\\s\\S]*?</div>'));
console.log('qqSettingsFields:', getBlock('{/\\* QQ fields — when Karakalpak is ON \\*/}.*?<div className="space-y-3[^>]*>([\\s\\S]*?)</div>\\s*\\)}'));
console.log('ruSettingsFields:', getBlock('{/\\* RU fields — when Russian is ON \\*/}.*?<div className="space-y-3[^>]*>([\\s\\S]*?)</div>\\s*\\)}'));
console.log('templateFields:', getBlock('{/\\* Template specific fields \\*/}\\s*{templateFields.length > 0 && \\(([\\s\\S]*?)\\)}'));
console.log('uzCoreFields:', getBlock('{/\\* Core fields \\*/}\\s*{isUzOn && \\(\\s*<div className="glass p-5 space-y-4">\\s*<h3.*?</h3>([\\s\\S]*?)</div>\\s*\\)}'));
console.log('dateLocation:', getBlock('{/\\* Date & location \\*/}\\s*<div className="glass p-5 space-y-4">\\s*<h3.*?</h3>([\\s\\S]*?)</div>'));
console.log('uzMessage:', getBlock('{/\\* Message \\*/}\\s*{isUzOn && \\(\\s*<div className="glass p-5 space-y-3">\\s*<h3.*?</h3>([\\s\\S]*?)</div>\\s*\\)}'));
console.log('musicBlock:', getBlock('<div>\\s*<label className="label flex items-center gap-1\\.5">🎵 {t\\(\\'step3\\.music\\'\\)}</label>([\\s\\S]*?)(?={/\\* Program / Timeline editor \\*/})'));
console.log('uzProgram:', getBlock('{/\\* Program / Timeline editor \\*/}\\s*{isUzOn && \\(\\s*<div>([\\s\\S]*?)(?=</div>\\s*\\)\\})</div>\\s*\\)}'));
console.log('qqProgram:', getBlock('{/\\* Karakalpak Program editor — when QQ is ON \\*/}\\s*{data\\.customFields\\?\\.langQq && \\(\\s*<div>([\\s\\S]*?)(?=</div>\\s*\\)\\})</div>\\s*\\)}'));
console.log('ruProgram:', getBlock('{/\\* Russian Program editor — when RU is ON \\*/}\\s*{data\\.customFields\\?\\.langRu && \\(\\s*<div>([\\s\\S]*?)(?=</div>\\s*\\)\\})</div>\\s*\\)}'));
console.log('restExtras:', getBlock('{/\\* Color Palette \\*/}([\\s\\S]*?)(?=</div>\\s*</div>\\s*\\);\\s*return \\()'));
