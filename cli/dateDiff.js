const moment = require('moment-timezone');
const inquirer = require('inquirer');
const fuzzy = require('fuzzy');

inquirer.registerPrompt('datepicker', require('inquirer-datepicker'));
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

function searchZones(answers, input = '') {
  return new Promise((res) => {
    const fuzzyResult = fuzzy.filter(input, moment.tz.names());
    res(fuzzyResult.map(el => el.original));
  });
}

const questions = [
  {
    type: 'datepicker',
    name: 'startDate',
    message: 'Enter start date (default now): ',
    format: ['MM', '/', 'DD', '/', 'Y', ' ', 'HH', ':', 'mm'],
    default: new Date(),
  },
  {
    type: 'autocomplete',
    name: 'startTimezone',
    message: 'Select starting timezone',
    source: searchZones,
  },
  {
    type: 'datepicker',
    name: 'endDate',
    message: 'Enter end date: ',
    format: ['MM', '/', 'DD', '/', 'Y', ' ', 'HH', ':', 'mm'],
  },
  {
    type: 'autocomplete',
    name: 'endTimezone',
    message: 'Select ending timezone',
    source: searchZones,
  },
  {
    type: 'list',
    name: 'unit',
    message: 'Select units to display',
    choices: ['day', 'minute', 'second', 'millisecond'],
  },
];

inquirer.prompt(questions).then((answers) => {
  const startDate = moment(answers.startDate.toISOString()).tz(answers.startTimezone, true);
  const endDate = moment(answers.endDate.toISOString()).tz(answers.endTimezone, true);
  const diff = endDate.diff(startDate, answers.unit);
  console.log(`${endDate} is ${diff} ${answers.unit + (diff === 1 ? '' : 's')} away`);
});
