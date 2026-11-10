// ينسخ أيقونة حصتي إلى مشروع أندرويد بعد كل مزامنة (hook: capacitor:sync:after)
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const res = path.join(root, 'android', 'app', 'src', 'main', 'res');

if (!fs.existsSync(res)) {
  console.log('apply-icon: مجلد أندرويد غير موجود بعد، تم التخطي.');
  process.exit(0);
}

let copied = 0;
const iconsDir = path.join(root, 'icons');
for (const dir of fs.readdirSync(iconsDir)) {
  const from = path.join(iconsDir, dir);
  if (!fs.statSync(from).isDirectory()) continue;
  const to = path.join(res, dir);
  fs.mkdirSync(to, { recursive: true });
  for (const f of fs.readdirSync(from)) {
    fs.copyFileSync(path.join(from, f), path.join(to, f));
    copied++;
  }
}

fs.mkdirSync(path.join(res, 'values'), { recursive: true });
fs.writeFileSync(
  path.join(res, 'values', 'hissati_colors.xml'),
  '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="hissati_icon_bg">#1B5CCF</color>\n</resources>\n'
);

const adaptive =
  '<?xml version="1.0" encoding="utf-8"?>\n' +
  '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n' +
  '    <background android:drawable="@color/hissati_icon_bg"/>\n' +
  '    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>\n' +
  '</adaptive-icon>\n';
fs.mkdirSync(path.join(res, 'mipmap-anydpi-v26'), { recursive: true });
fs.writeFileSync(path.join(res, 'mipmap-anydpi-v26', 'ic_launcher.xml'), adaptive);
fs.writeFileSync(path.join(res, 'mipmap-anydpi-v26', 'ic_launcher_round.xml'), adaptive);

console.log('apply-icon: تم نسخ ' + copied + ' صورة للأيقونة.');
