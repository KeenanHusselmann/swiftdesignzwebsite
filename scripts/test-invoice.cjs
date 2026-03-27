const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const errors = [];
  const warnings = [];
  const logs = [];

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') errors.push(text);
    else if (type === 'warning') warnings.push(text);
    else logs.push(`[${type}] ${text}`);
  });

  page.on('pageerror', err => errors.push('PAGE ERROR: ' + err.message));

  await page.goto('http://localhost:8788/docs/invoice-template.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Log any console output
  console.log('=== CONSOLE ERRORS ===');
  errors.forEach(e => console.log(e));
  console.log('=== CONSOLE WARNINGS ===');
  warnings.forEach(w => console.log(w));
  console.log('=== CONSOLE LOGS ===');
  logs.forEach(l => console.log(l));

  // Test 1: Check that dates are auto-filled
  const invDate = await page.$eval('#inv-date', el => el.textContent);
  const dueDate = await page.$eval('#inv-due-date', el => el.textContent);
  console.log('\n=== DATE FIELDS ===');
  console.log('Invoice date:', invDate);
  console.log('Due date:', dueDate);

  // Test 2: Check invoice number
  const invNums = await page.$$eval('.inv-num', els => els.map(e => e.textContent));
  console.log('inv-num values:', invNums);

  // Test 3: Check initial totals
  const subtotal = await page.$eval('#tot-subtotal', el => el.textContent);
  const balance = await page.$eval('#tot-balance', el => el.textContent);
  console.log('\n=== TOTALS ===');
  console.log('Subtotal:', subtotal);
  console.log('Balance:', balance);

  // Test 4: Try entering a price and see if calculation updates
  const priceCell = await page.$('.inv-price');
  await priceCell.click({ clickCount: 3 }); // Select all
  await priceCell.fill('');
  await priceCell.type('5000');
  await page.waitForTimeout(300);

  const subtotalAfter = await page.$eval('#tot-subtotal', el => el.textContent);
  const balanceAfter = await page.$eval('#tot-balance', el => el.textContent);
  const amtCell = await page.$eval('.inv-line-amt', el => el.textContent);
  console.log('\n=== AFTER TYPING 5000 IN PRICE FIELD ===');
  console.log('Line amount:', amtCell);
  console.log('Subtotal:', subtotalAfter);
  console.log('Balance:', balanceAfter);

  // Test 5: Check export button exists
  const exportBtn = await page.$('#export-btn');
  console.log('\nexport-btn exists:', !!exportBtn);

  // Test 6: Check setStatus
  await page.click('#s-paid');
  await page.waitForTimeout(200);
  const paidOpacity = await page.$eval('#s-paid', el => el.style.opacity);
  const outstandingOpacity = await page.$eval('#s-outstanding', el => el.style.opacity);
  console.log('\n=== STATUS BADGES after clicking Paid ===');
  console.log('Paid opacity:', paidOpacity);
  console.log('Outstanding opacity:', outstandingOpacity);

  // Test 7: Check if html-docx-js loaded
  const htmlDocxLoaded = await page.evaluate(() => typeof htmlDocx !== 'undefined');
  const fileSaverLoaded = await page.evaluate(() => typeof saveAs !== 'undefined');
  console.log('\n=== CDN SCRIPTS ===');
  console.log('html-docx-js loaded:', htmlDocxLoaded);
  console.log('file-saver loaded:', fileSaverLoaded);

  await browser.close();
})();
