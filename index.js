var through = require('through2');
var gutil = require('gulp-util');
var fs = require('fs');

var pack = require('./package.json');

var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-escomplex-reporter-html';

function gulpESComplexReporterHTML ( ) {
  // reporting information
  var data = { };
  data.reports = [ ];
  var cwd;

  // Creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, callback) {
    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    if (!file.isNull() && file.analysis) {
      try {
        var analysis = JSON.parse(file.analysis.toString('utf8'));

        if (!cwd) {
          cwd = file.cwd;
        }

        var newFile = new gutil.File({
          contents: new Buffer(JSON.stringify(analysis)),
          cwd: file.cwd,
          base: file.base,
          path: file.base + "/complexity/" + file.relative + ".json"
        });

        data.reports.push(newFile.path.split(newFile.cwd + "/")[1]);

        if (!data.baseDir) {
          data.baseDir = file.base;
          data.cwd = file.cwd;
          data.reporterName = pack.name;
          data.reporterVersion = pack.version;
          if (analysis.meta) {
            if (analysis.meta.packageName) {
              data.packageName = analysis.meta.packageName;
            }

            if (analysis.meta.packageVersion) {
              data.packageVersion = analysis.meta.packageVersion;
            }

            if (analysis.meta.analysis) {
              data.analysis = analysis.meta.analysis;
            }

            if (analysis.meta.analysisVersion) {
              data.analysisVersion = analysis.meta.analysisVersion;
            }
          }
        }

        this.push(newFile);
      } catch (err) {
        return callback(new PluginError(PLUGIN_NAME, 'Unable to decode escomplex analysis'));
      }
    }

    callback();
  }, function (callback) {
    data.created = new Date().toISOString();
    var indexFile = new gutil.File({
      cwd: data.cwd,
      base: data.baseDir,
      path: data.baseDir + "/complexity/index.json",
      contents: new Buffer(JSON.stringify(data))
    });

    this.push(indexFile);

    var reporter = fs.readFileSync(__dirname + '/reporter/index.html', 'utf8');
    var css = fs.readFileSync(__dirname + '/reporter/css/site.css', 'utf8');
    var js1 = fs.readFileSync(__dirname + '/reporter/js/angular-dimple.js', 'utf8');
    var js2 = fs.readFileSync(__dirname + '/reporter/js/complexity.js', 'utf8');

    var f1 = new gutil.File({
      cwd: data.cwd,
      base: data.baseDir,
      path: data.baseDir + "/index.html",
      contents: new Buffer(reporter)
    });

    var f2 = new gutil.File({
      cwd: data.cwd,
      base: data.baseDir,
      path: data.baseDir + "/css/site.css",
      contents: new Buffer(css)
    });

    var f3 = new gutil.File({
      cwd: data.cwd,
      base: data.baseDir,
      path: data.baseDir + "/js/angular-dimple.js",
      contents: new Buffer(js1)
    });

    var f4 = new gutil.File({
      cwd: data.cwd,
      base: data.baseDir,
      path: data.baseDir + "/js/complexity.js",
      contents: new Buffer(js2)
    });

    this.push(f1);
    this.push(f2);
    this.push(f3);
    this.push(f4);

    callback();
  });

  // returning the file stream
  return stream;
}

// Exporting the plugin main function
module.exports = gulpESComplexReporterHTML;
