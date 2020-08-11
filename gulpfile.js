/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-27 15:27:26
 * @LastEditTime: 2019-09-27 14:10:31
 * @LastEditors: Please set LastEditors
 */
var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var htmlmin = require("gulp-htmlmin");
var del = require("del");
var browserSync = require("browser-sync").create();
var babel = require("gulp-babel");
var jshint = require("gulp-jshint");
var postcss = require("gulp-postcss");
var pxtoviewport = require("postcss-px-to-viewport");
var zip = require("gulp-zip");
var useref = require("gulp-useref");
var autoprefixer = require("gulp-autoprefixer");
var ts = require("gulp-typescript");
const vinylPaths = require("vinyl-paths");
var tsProject = ts.createProject("tsconfig.json");

var app = {
  srcPath: "src/", //开发目录
  prdPath: "dist/" //发布目录
};

//复制开发目录的html文件到生产和发布目录
gulp.task("html", function() {
  var options = {
    removeComments: true, //清除HTML注释
    collapseWhitespace: true, //压缩HTML
    collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
    minifyJS: true, //压缩页面JS
    minifyCSS: true //压缩页面CSS
  };
  return gulp
    .src(app.srcPath + "**/*.html")
    .pipe(useref({}))
    .pipe($.if("css/*.css", $.minifyCss()))
    .pipe($.if("js/*.js", $.uglify()))
    .pipe($.if("*.html", htmlmin(options)))
    .pipe(gulp.dest(app.prdPath));
});

//将less文件编译为css 并压缩css文件到发布目录
gulp.task("less", function() {
  var processors = [
    pxtoviewport({
      viewportWidth: 750, //视图宽度
      viewportUnit: "vw", //视图单位
      unitPrecision: 3, //小数保留位数
      minPixelValue: 1, //最小单位
      selectorBlackList: [] //不打包的class
    })
  ];
  return gulp
    .src(app.srcPath + "style/less/*.less")
    .pipe($.less())
    .pipe(postcss(processors))
    .pipe(autoprefixer())
    .pipe(gulp.dest(app.srcPath + "style/css"));
  // .pipe($.concat("index.css"))
  // .pipe($.minifyCss())
  // .pipe(gulp.dest(app.prdPath + "css"));
});

// js代码检查
gulp.task("jsLint", function() {
  return gulp
    .src(app.srcPath + "js/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
});

// 压缩 编译 js文件
gulp.task(
  "js",
  gulp.series("jsLint", function() {
    return gulp.src(app.srcPath + "js/*.js").pipe(
      babel({
        presets: ["@babel/env"]
      })
    );
    // .pipe($.concat("index.js"))
    // .pipe($.uglify())
    // .pipe(gulp.dest(app.prdPath + "js"));
  })
);

//压缩图片
gulp.task("img", function() {
  return gulp
    .src(app.srcPath + "img/**/*")
    .pipe(
      $.imagemin({
        optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
        progressive: true //类型：Boolean 默认：false 无损压缩jpg图片
      })
    )
    .pipe(gulp.dest(app.prdPath + "img"));
});

//将开发目录的js依赖库复制到发布目录中
gulp.task("copyLib", function() {
  return gulp.src(app.srcPath + "lib/**").pipe(gulp.dest(app.prdPath + "lib"));
});

//开启本地服务 监听文件的变化
gulp.task("server", function() {
  browserSync.init({
    server: {
      baseDir: app.srcPath
    },
    port: 8090
  });
  gulp
    .watch(app.srcPath + "img/**/*", gulp.series("img"))
    .on("change", browserSync.reload);
  gulp
    .watch(app.srcPath + "style/less/*.less", gulp.series("less"))
    .on("change", browserSync.reload);
  gulp
    .watch(app.srcPath + "js/**/*.js", gulp.series("js"))
    .on("change", browserSync.reload);
  gulp
    .watch(app.srcPath + "**/*.html", gulp.series("html"))
    .on("change", browserSync.reload);
});

//清除发布目录的全部文件
gulp.task("clean", function() {
  return del([app.prdPath]);
});

//压缩dist文件
gulp.task("zip", function() {
  return gulp
    .src("dist/**/*")
    .pipe(zip("dist.zip"))
    .pipe(gulp.dest(app.prdPath));
});

//构建发布文件
gulp.task(
  "build",
  gulp.series(
    "clean",
    gulp.series(gulp.parallel("img", "js", "html", "copyLib"), "zip")
  )
);

//定义默认任务
gulp.task("default", gulp.series("server"));
// gulp.task("default", function() {
//   return tsProject.src()
//         .pipe(tsProject())
//         .js.pipe(gulp.dest(app.prdPath + "js"))
// })
