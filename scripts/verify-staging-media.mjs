import assert from "node:assert/strict";
import { createRequire } from "node:module";

const { chromium } = createRequire(import.meta.url)("playwright");

(async () => {
  const browser = await chromium.launch();
  try {
    for (const viewport of [{width: 1440, height: 1000}, {width: 390, height: 844}]) {
      const page = await browser.newPage({ viewport, isMobile: viewport.width === 390, hasTouch: viewport.width === 390 });
      for (const route of [{name:'home', hash:'/', selector:'.hero-render img', count:1}, {name:'labs', hash:'/#/labs', selector:'.lab-image-grid img', count:3}]) {
        await page.goto('https://magic-justice-lab.mightymaxworks.workers.dev' + route.hash, { waitUntil:'domcontentloaded' });
        const images = page.locator(route.selector);
        await images.first().waitFor({state:'attached'});
        assert.equal(await images.count(), route.count);
        for (const img of await images.all()) {
          await img.scrollIntoViewIfNeeded();
          await img.evaluate(node => node.decode());
          const layout = await img.evaluate(node => {
            const rect = node.getBoundingClientRect();
            return {width:rect.width, height:rect.height, naturalWidth:node.naturalWidth};
          });
          assert.ok(layout.width > 0 && layout.height > 0 && layout.naturalWidth === 1500);
        }
        if (route.name === 'home') {
          assert.match(await page.locator('h1').innerText(), /Imagine Better Justice\.\s+Build It Together\./);
          const credit = page.locator('.hero + .ourown-credit');
          await credit.waitFor({state:'visible'});
          assert.match(await credit.innerText(), /Computing powered by OurOwn[\s\S]*Metazone Digital/);
          assert.equal(await credit.locator('a').getAttribute('href'), 'https://ourown.one/');
        } else {
          const credit = page.locator('.concept-gallery + .lab-computing');
          await credit.waitFor({state:'visible'});
          assert.match(await credit.innerText(), /OurOwn[\s\S]*Metazone Digital/);
        }
        assert.equal(await page.locator('footer .ourown-footer-credit').getAttribute('href'), 'https://ourown.one/');
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        console.log(viewport.width, route.name, route.count, 'decoded and visible');
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
