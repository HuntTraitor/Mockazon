import * as fs from 'fs';
import * as path from 'path';

interface StatementCoverage {
  total: number;
  covered: number;
}

interface FileCoverage {
  path: string;
  s: { [key: string]: number };
  f: { [key: string]: number };
  b: { [key: string]: number[] };
  statementMap: { [key: string]: { start: any; end: any } };
  fnMap: { [key: string]: { name: string; decl: any; loc: any } };
  branchMap: { [key: string]: any };
}

interface CoverageFile {
  [filePath: string]: FileCoverage;
}

interface CoverageSummary {
  lines: StatementCoverage;
  statements: StatementCoverage;
  functions: StatementCoverage;
  branches: StatementCoverage;
}

const coverageFilePath = path.resolve(__dirname, 'coverage.json');

function readCoverageFile(filePath: string): CoverageFile {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData) as CoverageFile;
}

function calculateCoverageSummary(coverageData: CoverageFile): CoverageSummary {
  const summary: CoverageSummary = {
    lines: { total: 0, covered: 0 },
    statements: { total: 0, covered: 0 },
    functions: { total: 0, covered: 0 },
    branches: { total: 0, covered: 0 },
  };

  for (const file in coverageData) {
    const fileCoverage = coverageData[file];

    summary.statements.total += Object.keys(fileCoverage.statementMap).length;
    summary.statements.covered += Object.values(fileCoverage.s).filter(value => value > 0).length;

    summary.functions.total += Object.keys(fileCoverage.fnMap).length;
    summary.functions.covered += Object.values(fileCoverage.f).filter(value => value > 0).length;

    summary.branches.total += Object.keys(fileCoverage.branchMap).length;
    summary.branches.covered += Object.values(fileCoverage.b).filter(value => value.every(v => v > 0)).length;

    summary.lines.total += Object.keys(fileCoverage.statementMap).length; // Assuming line coverage is similar to statement coverage
    summary.lines.covered += Object.values(fileCoverage.s).filter(value => value > 0).length;
  }

  return summary;
}

function printCoverageReport(summary: CoverageSummary) {
  const linesPct = (summary.lines.covered / summary.lines.total) * 100;
  const statementsPct = (summary.statements.covered / summary.statements.total) * 100;
  const functionsPct = (summary.functions.covered / summary.functions.total) * 100;
  const branchesPct = (summary.branches.covered / summary.branches.total) * 100;

  console.log('Coverage Summary:');
  console.log(`Lines: ${linesPct.toFixed(2)}% (Covered: ${summary.lines.covered} / Total: ${summary.lines.total})`);
  console.log(`Statements: ${statementsPct.toFixed(2)}% (Covered: ${summary.statements.covered} / Total: ${summary.statements.total})`);
  console.log(`Functions: ${functionsPct.toFixed(2)}% (Covered: ${summary.functions.covered} / Total: ${summary.functions.total})`);
  console.log(`Branches: ${branchesPct.toFixed(2)}% (Covered: ${summary.branches.covered} / Total: ${summary.branches.total})`);
}

// Main execution
const coverageData = readCoverageFile(coverageFilePath);
const coverageSummary = calculateCoverageSummary(coverageData);
printCoverageReport(coverageSummary);
