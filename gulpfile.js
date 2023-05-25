const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgmin = require("gulp-svgmin");
const browserSync = require("browser-sync").create();

// Объединение и минимизация стилей
gulp.task("styles", () => {
  return gulp
    .src("src/scss/main.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("main.css"))
    .pipe(autoprefixer())
    .pipe(
      cleanCSS({
        format: "beautify",
      })
    )
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
});

// Объединение и минимизация скриптов
gulp.task("scripts", function () {
  return gulp
    .src("src/js/**/*.js")
    .pipe(concat("main.js"))
    .pipe(gulp.dest("dist/js/"))
    .pipe(browserSync.stream());
});

// Оптмизиация изображений и перевод в формат WebP
gulp.task("images", function () {
  return gulp
    .src("src/img/**/*.{jpg,jpeg,png,gif}")
    .pipe(imagemin())
    .pipe(webp())
    .pipe(gulp.dest("dist/img/"))
    .pipe(browserSync.stream());
});

// Оптимизация SVG
gulp.task("svg", function () {
  return gulp
    .src("src/img/svg/**/*.svg")
    .pipe(svgmin())
    .pipe(gulp.dest("dist/img/svg/"))
    .pipe(browserSync.stream());
});

// Синхронизация остальных папок
gulp.task("folders", function () {
  return gulp
    .src(["src/index.html", "src/partials/**/*", "src/resources/**/*"], {
      base: "src",
    })
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
});

// Наблюдаем за изменениями
gulp.task("watch", () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });

  gulp.watch("src/scss/**/*.scss", gulp.series("styles"));
  gulp.watch("src/js/**/*.js", gulp.series("scripts"));
  gulp.watch("src/img/*.{jpg,jpeg,png,gif}", gulp.series("images"));
  gulp.watch("src/img/svg/*.svg", gulp.series("svg"));
  gulp
    .watch(
      ["src/partials/**/*", "src/resources/**/*", "src/index.html"],
      gulp.series("folders")
    )
    .on("change", browserSync.reload);
});

gulp.task(
  "default",
  gulp.series("styles", "scripts", "images", "svg", "folders", "watch")
);
