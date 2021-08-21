var glob = require('glob');

glob('uploads/**/campus_mart.pdf', function(err, files) {
  console.log(files);
  if (files[0].includes('students/assignment')) {
    console.log('yes');
  }
});