const
  path = require('path'),

  config = {
    paths: {
      root: `${path.dirname(require.main.filename)}/`
    },
    browserSync:{
      // proxy: "localhost:3000"
      server:{
        baseDir:/*path.dirname(require.main.filename)*/'./'
        ,index:'index.html'
      }
     ,port:3000
     ,open: false
    }
  }
;

const
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  /**/
  rename = require('gulp-rename'),
  /*pump is a small node module that pipes streams together and destroys all of them if one of them closes*/
  pump = require('pump'),
  /**/
  webpack = require('webpack'),
  browserSync = require('browser-sync')
  /*FOR CSS*/
  /**/
  sass = require('gulp-sass'),
  /**/
  autoprefixer = require('gulp-autoprefixer'),
  /**/
  cleanCSS = require('gulp-clean-css')
;

gulp.task('webpack', (callback) => {

  webpack({
    entry: path.join(config.paths.root, './source/js/index.js'),
    output: {
      path: path.join(config.paths.root, './public/js/'),
      filename: 'bundle.js'
    },
    watch: true,
    watchOptions: {
      aggregateTimeout: 100
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        }
      ]
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
      })
    ]
  },
  (err, stats) => {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
        // output options
    }));
    callback();
    console.log('done webpack');
    // browserSync.reload;

  });

});


gulp.task('scss', (callback) => {
  pump([
       gulp.src(['./source/scss/*.scss', '!_*.scss'])
      ,sass({
          /*includePaths: []*/
          /* ,imagePath: 'path/to/images' */
      }).on('error', sass.logError)
       /*https://github.com/ai/browserslist*/
      ,autoprefixer(/*'last 2 version',*/'> 1%'/*'Explorer >= 8'*/,{
        cascade:false
       })
      ,cleanCSS({
        compatibility: 'ie8'
        ,advanced: false
        ,sourceMap: true
        // ,aggressiveMerging:false
      })
      ,rename({suffix: '.min'})
      ,gulp.dest('./public/css/')
      ,browserSync.stream()
    ],
    callback
  );
  /**/
});

gulp.task('default', (callback) => {
  /**/
  gulp.start('scss');
  /*init browser-sync*/
  browserSync(config.browserSync);
  /*start webpack task*/
  gulp.start('webpack', (callback) => {
    // console.log(callback);

  });

  /**/
  gulp.watch('./index.html', browserSync.reload);
  /**/
  gulp.watch('./source/js/**/*.js', (callback) => {
    // gulp.start('webpack', (callback) => {
    //
    // });
  });
  /**/
  gulp.watch('./source/scss/**/*.scss', ['scss']);

  /**/
  gulp.watch('./public/js/**/*.js', browserSync.reload);
  /**/
  gulp.watch('./source/tags/**/*.tag', browserSync.reload);

}).start('default');
