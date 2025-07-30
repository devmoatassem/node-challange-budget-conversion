const REQUIRED_PROJECTS = [
  'Peking roasted duck Chanel',
  'Choucroute Cartier',
  'Rigua Nintendo',
  'Llapingacho Instagram'
]

const PROJECT_DATA_STRUCTURE = {
  projectId: 'number',
  projectName: 'string',
  year: 'number',
  currency: 'string',
  initialBudgetLocal: 'number',
  budgetUsd: 'number',
  initialScheduleEstimateMonths: 'number',
  adjustedScheduleEstimateMonths: 'number',
  contingencyRate: 'number',
  escalationRate: 'number',
  finalBudgetUsd: 'number'
}

const PROJECT_CURRENCY_DATA_REQUEST = {
  year: 'number',
  projectName: 'string',
  currency: 'string'
}

const API_CONVERSION_DATA_REQUEST = {
  currency: 'string',
  projectName: 'string'
}

module.exports = { REQUIRED_PROJECTS, PROJECT_DATA_STRUCTURE, PROJECT_CURRENCY_DATA_REQUEST, API_CONVERSION_DATA_REQUEST }
