var test = require('tape'),
    vinyl = require('vinyl'),
    complex = require('../');

var textContentsInput = '{ "foo": "bar" }';

var testFile = new vinyl({
  cwd: "/home/jerry/work",
  base: "/home/jerry/work/test",
  path: "/home/jerry/work/test/file.js",
  contents: new Buffer(textContentsInput)
});

testFile.analysis = testFile.contents;

test('should return complexity results as JSON', function (t) {
  t.plan(6);

  var stream = complex();
  stream.on('data', function (newFile) {
    t.ok(newFile, 'emits a file');
    t.ok(newFile.path, 'file has a path');
    t.ok(newFile.contents, 'file has contents');
    t.ok(newFile.contents instanceof Buffer, 'file contents are a buffer');
    t.equal(newFile.path, '/home/jerry/work/test/complexity/file.js.json', 'file path updated');

    var analysis = JSON.parse(newFile.contents.toString('utf8'));

    t.equal(analysis.foo, 'bar', 'the JSON should be correct');
  });

  stream.write(testFile);
});
