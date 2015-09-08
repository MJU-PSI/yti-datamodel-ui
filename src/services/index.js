const name = 'iow.services';

const mod = angular.module(name, []);

mod.factory('groupService', require('./groupService'));
mod.factory('modelService', require('./modelService'));
mod.factory('languageService', require('./languageService'));

module.exports = name;
