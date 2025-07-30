const TEST_DATA = {
  projectId: 707078,
  projectName: 'Rigua Nintendo',
  year: 2024,
  currency: 'EUR',
  initialBudgetLocal: 316974.5,
  budgetUsd: 233724.23,
  initialScheduleEstimateMonths: 13,
  adjustedScheduleEstimateMonths: 12,
  contingencyRate: 2.19,
  escalationRate: 3.46,
  finalBudgetUsd: 247106.75
}

const UPDATE_DATA = {
  projectName: 'Project X',
  year: 2025,
  currency: 'USD',
  initialBudgetLocal: 1000000,
  budgetUsd: 1100000,
  initialScheduleEstimateMonths: 12,
  adjustedScheduleEstimateMonths: 14,
  contingencyRate: 10,
  escalationRate: 5,
  finalBudgetUsd: 1200000
}
const INVALID_DATA = {
  projectId: 463262,
  projectName: 111,
  year: 2024,
  currency: 'EUR',
  initialBudgetLocal: 316974.5,
  budgetUsd: 'string',
  initialScheduleEstimateMonths: 13,
  adjustedScheduleEstimateMonths: 12,
  contingencyRate: 2.19,
  escalationRate: 3.46,
  finalBudgetUsd: 247106.75
}
module.exports = {
  TEST_DATA,
  INVALID_DATA,
  UPDATE_DATA
}
