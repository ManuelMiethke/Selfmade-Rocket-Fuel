const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<input \s*type="number" \s*value=\{inputs\.volume\} \s*onChange=\{e => updateInput\('volume', Number\(e\.target\.value\)\)\} \s*min="100"\s*step="100"\s*\/>/g, `<input \n            type="text" inputMode="decimal"\n            value={inputs.volume} \n            onChange={e => updateInput('volume', e.target.value)} \n          />`);

code = code.replace(/<input \s*type="number" \s*value=\{inputs\.ratio\.glucose\} \s*onChange=\{e => updateInput\('ratio', \{ \.\.\.inputs\.ratio, glucose: Number\(e\.target\.value\) \}\)\} \s*min="0\.1"\s*step="0\.1"\s*style=\{\{ paddingLeft: '16px' \}\}\s*\/>/g, `<input \n                  type="text" inputMode="decimal"\n                  value={inputs.ratio.glucose} \n                  onChange={e => updateInput('ratio', { ...inputs.ratio, glucose: e.target.value })} \n                  style={{ paddingLeft: '16px' }}\n                />`);

code = code.replace(/<input \s*type="number" \s*value=\{inputs\.ratio\.fructose\} \s*onChange=\{e => updateInput\('ratio', \{ \.\.\.inputs\.ratio, fructose: Number\(e\.target\.value\) \}\)\} \s*min="0\.1"\s*step="0\.1"\s*style=\{\{ paddingLeft: '16px' \}\}\s*\/>/g, `<input \n                  type="text" inputMode="decimal"\n                  value={inputs.ratio.fructose} \n                  onChange={e => updateInput('ratio', { ...inputs.ratio, fructose: e.target.value })} \n                  style={{ paddingLeft: '16px' }}\n                />`);

code = code.replace(/<input \s*type="number" \s*value=\{inputs\.syrupMixRatioWater\} \s*onChange=\{e => updateInput\('syrupMixRatioWater', Number\(e\.target\.value\)\)\} \s*min="1"\s*style=\{\{ paddingLeft: '16px' \}\}\s*\/>/g, `<input \n              type="text" inputMode="decimal"\n              value={inputs.syrupMixRatioWater} \n              onChange={e => updateInput('syrupMixRatioWater', e.target.value)} \n              style={{ paddingLeft: '16px' }}\n            />`);

code = code.replace(/<input \s*type="number" \s*value=\{inputs\.syrupSugarPer100mlPrepared\} \s*onChange=\{e => updateInput\('syrupSugarPer100mlPrepared', Number\(e\.target\.value\)\)\} \s*min="0"\s*step="0\.1"\s*style=\{\{ paddingLeft: '16px' \}\}\s*\/>/g, `<input \n          type="text" inputMode="decimal"\n          value={inputs.syrupSugarPer100mlPrepared} \n          onChange={e => updateInput('syrupSugarPer100mlPrepared', e.target.value)} \n          style={{ paddingLeft: '16px' }}\n        />`);

code = code.replace(/\{Math\.round\(inputs\.syrupSugarPer100mlPrepared \* \(1 \+ inputs\.syrupMixRatioWater\)\)\}g/g, `{Math.round(safeNum(inputs.syrupSugarPer100mlPrepared) * (1 + safeNum(inputs.syrupMixRatioWater)))}g`);

fs.writeFileSync('src/App.tsx', code);
