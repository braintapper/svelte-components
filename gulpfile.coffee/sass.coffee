gulp   = require('gulp')
sass = require ('gulp-sass')

watchPath = ["src/_sass/**/*.sass"]
sourcePath = ["src/_sass/*.sass"]
destinationPath = "./public/css"

module.exports = ()->
  console.log sourcePath
  console.log destinationPath


  gulp.src("src/_sass/*.sass").pipe(sass({indentedSyntax: true}).on('error', sass.logError)).pipe(gulp.dest(destinationPath))

  gulp.src("src/_sass/vendor/**/*.sass").pipe(sass({indentedSyntax: true}).on('error', sass.logError)).pipe(gulp.dest("#{destinationPath}/vendor/"))




module.exports.watch = watchPath
module.exports.displayName = "sass"
#
