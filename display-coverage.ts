import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import Table from 'cli-table3';

interface CoverageData {
  pct: number;
  covered: number;
  total: number;
}

interface CoverageSummary {
  statements: CoverageData;
  branches: CoverageData;
  functions: CoverageData;
  lines: CoverageData;
}

const coverageFilePath = path.resolve('merged_coverage', 'index.html');

function readCoverageFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

function extractCoverageSummary(htmlContent: string): CoverageSummary {
  const $ = cheerio.load(htmlContent);
  const coverageData: CoverageSummary = {
    statements: {
      pct: parseFloat($('.strong').eq(0).text()),
      covered: parseInt($('.fraction').eq(0).text().split('/')[0], 10),
      total: parseInt($('.fraction').eq(0).text().split('/')[1], 10),
    },
    branches: {
      pct: parseFloat($('.strong').eq(1).text()),
      covered: parseInt($('.fraction').eq(1).text().split('/')[0], 10),
      total: parseInt($('.fraction').eq(1).text().split('/')[1], 10),
    },
    functions: {
      pct: parseFloat($('.strong').eq(2).text()),
      covered: parseInt($('.fraction').eq(2).text().split('/')[0], 10),
      total: parseInt($('.fraction').eq(2).text().split('/')[1], 10),
    },
    lines: {
      pct: parseFloat($('.strong').eq(3).text()),
      covered: parseInt($('.fraction').eq(3).text().split('/')[0], 10),
      total: parseInt($('.fraction').eq(3).text().split('/')[1], 10),
    },
  };
  return coverageData;
}

function extractDetailedCoverage(htmlContent: string) {
  const $ = cheerio.load(htmlContent);
  const rows: Array<{ [key: string]: string }> = [];
  $('tbody tr').each((index, element) => {
    const cols = $(element).children('td');
    rows.push({
      file: $(cols[0]).text(),
      statements: $(cols[2]).text(),
      branches: $(cols[4]).text(),
      functions: $(cols[6]).text(),
      lines: $(cols[8]).text(),
    });
  });
  return rows;
}

function colorize(text: string, color: string): string {
  const colors: { [key: string]: string } = {
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    reset: '\x1b[0m',
  };
  return `${colors[color]}${text}${colors.reset}`;
}

function formatCoverage(pct: number, covered: number, total: number, label: string) {
  const color = pct >= 80 ? 'green' : pct >= 50 ? 'yellow' : 'red';
  const labelStr = `${label}:`.padEnd(15);
  const pctStr = `${colorize(pct.toFixed(2) + '%', color)}`.padEnd(10);
  const coveredStr = `${covered}`.padStart(5);
  const totalStr = `${total}`.padStart(5);
  return `${labelStr} ${pctStr} (Covered: ${coveredStr} / Total: ${totalStr})`;
}

function colorizePct(pct: string): string {
  const pctValue = parseFloat(pct);
  const color = pctValue >= 80 ? 'green' : pctValue >= 50 ? 'yellow' : 'red';
  return colorize(pct, color);
}

function printCoverageReport(summary: CoverageSummary) {
  console.log('Coverage Summary:');
  console.log(formatCoverage(summary.lines.pct, summary.lines.covered, summary.lines.total, 'Lines'));
  console.log(formatCoverage(summary.statements.pct, summary.statements.covered, summary.statements.total, 'Statements'));
  console.log(formatCoverage(summary.functions.pct, summary.functions.covered, summary.functions.total, 'Functions'));
  console.log(formatCoverage(summary.branches.pct, summary.branches.covered, summary.branches.total, 'Branches'));
}

function printDetailedCoverage(detailedCoverage: Array<{ [key: string]: string }>) {
  const table = new Table({
    head: ['File', 'Statements', 'Branches', 'Functions', 'Lines'].map(header => colorize(header, 'reset')),
    colWidths: [40, 15, 15, 15, 15],
  });

  detailedCoverage.forEach(row => {
    table.push([
      row.file,
      colorizePct(row.statements),
      colorizePct(row.branches),
      colorizePct(row.functions),
      colorizePct(row.lines),
    ]);
  });

  console.log(table.toString());
}

const htmlContent = readCoverageFile(coverageFilePath);
const coverageSummary = extractCoverageSummary(htmlContent);
const detailedCoverage = extractDetailedCoverage(htmlContent);
printCoverageReport(coverageSummary);
console.log('\nDetailed Coverage:');
printDetailedCoverage(detailedCoverage);
