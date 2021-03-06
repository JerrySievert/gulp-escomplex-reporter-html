
var app = angular.module('Complexity', [ 'angular-dimple' ]);

app.controller('complexityController', function ($scope, $http) {
  $http.get('complexity/index.json')
  .success(function (data) {
    data.complexity = [ ];
    data.readableDate = new Date(Date.parse(data.created)).toString();

    var count = 0;

    for (var i = 0; i < data.reports.length; i++) {
      $http.get(data.reports[i])
      .success(function (complexity) {
        var functions = [ ];
        for (var f = 0; f < complexity.functions.length; f++) {
          var info = {
            "Cyclomatic Complexity": Number(complexity.functions[f].cyclomatic),
            "Halstead Difficulty": Number(complexity.functions[f].halstead.difficulty).toFixed(2),
            "Function": complexity.functions[f].name + " (Line " + complexity.functions[f].line + ")"
          };

          functions.push(info);
        }

        complexity.chart = functions;
        data.complexity.push(complexity);
        count++;

        if (count === data.reports.length) {
          $scope.data = data;
        }
      });
    }
  });
});
