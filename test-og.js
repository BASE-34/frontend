import http from 'http';

function fetchPage(path) {
  return new Promise((resolve) => {
    http.get('http://localhost:4173' + path, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', (e) => {
      resolve('ERROR: ' + e.message);
    });
  });
}

async function main() {
  const newsDetail = await fetchPage('/news/base34-beta-launch');
  console.log("=== NEWS DETAIL OG ===");
  const newsOg = typeof newsDetail === 'string' ? newsDetail.match(/<meta (property|name)="(og:|twitter:|description)[^>]+>/gi) : null;
  console.log(newsOg ? newsOg.join('\n') : "No OG tags");

  const projDetail = await fetchPage('/projects/base34-platform');
  console.log("\n=== PROJ DETAIL OG ===");
  const projOg = typeof projDetail === 'string' ? projDetail.match(/<meta (property|name)="(og:|twitter:|description)[^>]+>/gi) : null;
  console.log(projOg ? projOg.join('\n') : "No OG tags");

  const newsList = await fetchPage('/news');
  console.log("\n=== NEWS LIST OG ===");
  const nListOg = typeof newsList === 'string' ? newsList.match(/<meta (property|name)="(og:|twitter:|description)[^>]+>/gi) : null;
  console.log(nListOg ? nListOg.join('\n') : "No OG tags");

  const projList = await fetchPage('/projects');
  console.log("\n=== PROJ LIST OG ===");
  const pListOg = typeof projList === 'string' ? projList.match(/<meta (property|name)="(og:|twitter:|description)[^>]+>/gi) : null;
  console.log(pListOg ? pListOg.join('\n') : "No OG tags");
}

main();
