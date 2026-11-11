import assert from "node:assert/strict";
import { createRequire } from "node:module";

const staging = "https://magic-justice-lab.mightymaxworks.workers.dev";

async function verifyShareMetadata() {
  for (const [path, title] of [
    ["/", "MAGIC JusTICe Lab | Imagine Better Justice"],
    ["/innovation-labs", "Innovation Labs | MAGIC JusTICe Lab"],
    ["/projects/wpu-living-laboratory", "The WPU Living Laboratory | MAGIC JusTICe Lab"],
  ]) {
    const response = await fetch(staging + path, { headers: { "User-Agent": "Twitterbot/1.0" } });
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes(`<meta property="og:title" content="${title}"`));
    assert.ok(html.includes(`<link rel="canonical" href="${staging + path}"`));
    const image = path.startsWith("/projects") ? "/project-media/wpu-pickleball.webp" : "/images/hero-magic-lab.webp";
    assert.ok(html.includes(`<meta property="og:image" content="${staging}${image}"`));
    assert.ok(html.includes('<meta name="twitter:card" content="summary_large_image"'));
  }
  const sitemap = await fetch(staging + "/sitemap.xml");
  assert.equal(sitemap.status, 200);
  assert.match(await sitemap.text(), /<loc>[^<]+\/innovation-labs<\/loc>/);
}

const { chromium } = createRequire(import.meta.url)("playwright");

(async () => {
  await verifyShareMetadata();
  const browser = await chromium.launch();
  try {
    for (const viewport of [{width: 1440, height: 1000}, {width: 390, height: 844}]) {
      const page = await browser.newPage({ viewport, isMobile: viewport.width === 390, hasTouch: viewport.width === 390 });
      for (const route of [{name:'home', hash:'/', selector:'.hero-render img', count:1}, {name:'labs', hash:'/innovation-labs', selector:'.lab-image-grid img', count:3}, {name:'labs', hash:'/#/labs', selector:'.lab-image-grid img', count:3}]) {
        await page.goto(staging + route.hash, { waitUntil:'domcontentloaded' });
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
          assert.equal(await page.locator('.ourown-credit + .wpu-feature a').getAttribute('href'), '/projects/wpu-living-laboratory');
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
      await page.goto(staging + "/projects");
      await page.locator("main .wpu-image").scrollIntoViewIfNeeded();
      await page.locator("main .wpu-image").evaluate(img => img.decode());
      await page.getByRole("link", { name: "Read the WPU case study" }).click();
      await page.locator(".wpu-hero img").evaluate(img => img.decode());
      assert.equal(await page.locator(".appeal-steps li").count(), 3);
      await page.getByRole("heading", { name: "AI Governance in Practice: The WPU Living Laboratory" }).waitFor();
      assert.equal(await page.getByRole("link", { name: "World Pickleball Union" }).getAttribute("href"), "https://worldpickleball.world/");
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
