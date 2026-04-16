const fs = require('fs');

const file = 'client/src/components/Step3Content.jsx';
let content = fs.readFileSync(file, 'utf8');

// The strategy is to extract the functional blocks of JSX and reassemble them.
// We will extract inner contents of basic sections, and then re-form the 3 main boxes.

function getBlock(regexStr) {
  const match = content.match(new RegExp(regexStr, 's'));
  return match ? match[1] : '';
}

// 1. Lang Toggles
let langToggles = getBlock('<div className="space-y-2">\\s*{\\[[\\s\\S]*?</div>');

// 2. QQ fields inside lang settings
let qqSettingsFields = getBlock('{/\\* QQ fields — when Karakalpak is ON \\*/}.*?<div className="space-y-3[^>]*>([\\s\\S]*?)</div>\\s*\\)}');

// 3. RU fields inside lang settings
let ruSettingsFields = getBlock('{/\\* RU fields — when Russian is ON \\*/}.*?<div className="space-y-3[^>]*>([\\s\\S]*?)</div>\\s*\\)}');

// 4. Template fields
let templateFields = getBlock('{/\\* Template specific fields \\*/}\\s*{templateFields.length > 0 && \\(([\\s\\S]*?)\\)}');

// 5. Core Fields (UZ) 
let uzCoreFields = getBlock('{/\\* Core fields \\*/}\\s*{isUzOn && \\(\\s*<div className="glass p-5 space-y-4">\\s*<h3.*?</h3>([\\s\\S]*?)</div>\\s*\\)}');

// 6. Date & Location 
let dateLocation = getBlock('{/\\* Date & location \\*/}\\s*<div className="glass p-5 space-y-4">\\s*<h3.*?</h3>([\\s\\S]*?)</div>');

// 7. Message (UZ)
let uzMessage = getBlock('{/\\* Message \\*/}\\s*{isUzOn && \\(\\s*<div className="glass p-5 space-y-3">\\s*<h3.*?</h3>([\\s\\S]*?)</div>\\s*\\)}');

// 8. Music
let musicBlock = getBlock('<div>\\s*<label className="label flex items-center gap-1\\.5">🎵 {t\\(\'step3\\.music\'\\)}</label>([\\s\\S]*?)(?={/\\* Program / Timeline editor \\*/})');

// 9. Program UZ
let uzProgram = getBlock('{/\\* Program / Timeline editor \\*/}\\s*{isUzOn && \\(\\s*<div>([\\s\\S]*?)(?=</div>\\s*\\)\\})</div>\\s*\\)}');

// 10. Program QQ
let qqProgram = getBlock('{/\\* Karakalpak Program editor — when QQ is ON \\*/}\\s*{data\\.customFields\\?\\.langQq && \\(\\s*<div>([\\s\\S]*?)(?=</div>\\s*\\)\\})</div>\\s*\\)}');

// 11. Program RU
let ruProgram = getBlock('{/\\* Russian Program editor — when RU is ON \\*/}\\s*{data\\.customFields\\?\\.langRu && \\(\\s*<div>([\\s\\S]*?)(?=</div>\\s*\\)\\})</div>\\s*\\)}');

// 12. Rest of Extras (Color palette, Bot, Switchers)
let restExtras = getBlock('{/\\* Color Palette \\*/}([\\s\\S]*?)(?=</div>\\s*</div>\\s*\\);\\s*return \\()');

const newFormContent = `  const formContent = (
    <div className="space-y-5">
      {/* BOX 1: LANGUAGE SETTINGS */}
      <div className="glass p-5 space-y-4">
        <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
          🌐 {t('step3.langSettings')}
        </h3>
        <p className="text-[11px] text-surface-500">{t('step3.langDesc')}</p>
        <div className="space-y-2">
${langToggles}
        </div>
      </div>

      {/* BOX 2: LANGUAGE SPECIFIC TEXTS */}
      <div className="glass p-5 space-y-8">
        <h3 className="text-xs font-semibold text-primary-300 uppercase tracking-wider flex items-center gap-2">
          ✍️ Matnlar (Texts)
        </h3>
        
        {isUzOn && (
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold text-surface-400 bg-white/5 inline-block px-2 py-1 rounded">🇺🇿 O'zbek tili</h4>
${uzCoreFields}
${uzMessage}
            <div>
${uzProgram}
            </div>
          </div>
        )}

        {data.customFields?.langQq && (
          <div className="space-y-4 border-t border-white/10 pt-6">
            <h4 className="text-[11px] font-bold text-surface-400 bg-white/5 inline-block px-2 py-1 rounded">🇰🇦 Qaraqalpaq tili</h4>
${qqSettingsFields}
            <div>
${qqProgram}
            </div>
          </div>
        )}

        {data.customFields?.langRu && (
          <div className="space-y-4 border-t border-white/10 pt-6">
            <h4 className="text-[11px] font-bold text-surface-400 bg-white/5 inline-block px-2 py-1 rounded">🇷🇺 Rus tili</h4>
${ruSettingsFields}
            <div>
${ruProgram}
            </div>
          </div>
        )}
      </div>

      {/* BOX 3: GLOBAL / NON-LANGUAGE CONFIGURATIONS */}
      <div className="glass p-5 space-y-8">
        <h3 className="text-xs font-semibold text-primary-300 uppercase tracking-wider flex items-center gap-2">
          ⚙️ Asosiy ma'lumotlar va Sozlamalar
        </h3>
        
        {templateFields.length > 0 && (
${templateFields}
        )}

        <div className="space-y-4">
${dateLocation}
        </div>

        <div>
          <label className="label flex items-center gap-1.5">🎵 {t('step3.music')}</label>
${musicBlock}
        </div>

        {/* Color Palette */ }
${restExtras.trim()}
      </div>
    </div>
  );`;

// Replace from 'const formContent = (' up to the 'return (' corresponding to the end of formContent
const startPattern = 'const formContent = (';
const endPattern = 'return (\\n    <motion.div';
const prefix = content.substring(0, content.indexOf(startPattern));
const suffix = content.substring(content.indexOf(endPattern));

if(prefix.length > 0 && suffix.length > 0 && langToggles) {
    fs.writeFileSync(file, prefix + newFormContent + '\\n\\n  ' + suffix, 'utf8');
    console.log("Successfully reshaped the UI blocks.");
} else {
    console.log("Failed to parse some blocks. Please check regex.");
}
