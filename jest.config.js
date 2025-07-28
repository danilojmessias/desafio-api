module.exports = {
  testEnvironment: 'node',
  reporters: [
    "default",
    ["jest-allure2-reporter", {
      "resultsDir": "allure-results"
    }]
  ]
};