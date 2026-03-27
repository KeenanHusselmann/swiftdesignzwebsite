const fs = require('fs');
const html = fs.readFileSync('c:/Users/keena/Projects/swift-designz-website/public/docs/invoice-template.html', 'utf8');

const ceMatches = (html.match(/contenteditable/g) || []).length;
console.log('contenteditable occurrences:', ceMatches);

const tbodyMatch = html.match(/<tbody id="services-tbody">([\s\S]*?)<\/tbody>/);
if (tbodyMatch) {
  const tbodyRows = (tbodyMatch[1].match(/<tr>[\s\S]*?<\/tr>/g) || []);
  console.log('Services rows:', tbodyRows.length);
  tbodyRows.forEach(function(row, i) {
    const hasQty = /inv-qty/.test(row);
    const hasPrice = /inv-price/.test(row);
    const hasAmt = /inv-line-amt/.test(row);
    console.log('  Row ' + (i+1) + ' - qty: ' + hasQty + ' price: ' + hasPrice + ' amt: ' + hasAmt);
  });
}

const lastChars = html.slice(-50);
console.log('Last 50 chars:', JSON.stringify(lastChars));

// Check if calcAll is accessible from IIFE (hoisting ok)
// Check that inv-num spans get properly synced
const invNumSpans = (html.match(/class="[^"]*inv-num[^"]*"/g) || []).length;
console.log('inv-num spans:', invNumSpans);

// Look for specific bugs: does the IIFE call calcAll before it's defined?
const iifeIdx = html.indexOf('(function(){');
const calcDefIdx = html.indexOf('function calcAll()');
console.log('IIFE starts at index:', iifeIdx, 'calcAll defined at:', calcDefIdx);
console.log('calcAll is defined AFTER IIFE starts (hoisting required):', calcDefIdx > iifeIdx);

// Check export-btn exists and is properly formed
const hasExportBtn = html.includes('id="export-btn"');
const hasNewInvBtn = html.includes('id="new-inv-btn"');
console.log('export-btn exists:', hasExportBtn, '| new-inv-btn exists:', hasNewInvBtn);

// Check CDN scripts
const cdnScripts = (html.match(/src="https:\/\/cdn\.jsdelivr\.net[^"]+"/g) || []);
console.log('CDN scripts:', cdnScripts);
