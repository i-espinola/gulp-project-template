// Setting ES version
/* jshint esversion: 6 */

// Setting paths
// ------------------------

import del from 'del';
import {
  src, dest, watch, parallel, series,
} from 'gulp';
import sass from 'gulp-sass';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import htmlmin from 'gulp-htmlmin';
import image from 'gulp-image';
import cleanCSS from 'gulp-clean-css';
import browserSync from 'browser-sync';

const path = {
  source: ['./src'],
  build: ['./dest'],
  views: {
    src: [
      './src/views/*',
      './src/views/**/*',
    ],
    build: './dest',
  },
  styles: {
    src: [
      './src/assets/scss/*.css',
      './src/assets/scss/*.scss',
      './src/assets/scss/**/*.scss',
    ],
    build: './dest/assets/css',
  },
  scripts: {
    src: [
      './src/assets/js/*.js',
    ],
    build: './dest/assets/js',
  },
  img: {
    src: [
      './src/assets/img/*',
      './src/assets/img/**/*',
    ],
    build: './dest/assets/img',
  },
  font: {
    src: [
      './assets/font/*',
      './assets/font/**/*',
    ],
    build: './dest/assets/font',
  },
  icon: {
    src: [
      './assets/icon/*',
      './assets/icon/**/*',
    ],
    build: './dest/assets/icon',
  },
};

// Task View
export const views = () => src(path.views.src)
  .pipe(htmlmin({
    collapseWhitespace: true,
    removeComments: true,
  }))
  .pipe(dest(path.views.build))
  .pipe(browserSync.stream());

// Task Otimize Images
export const imgs = () => src(path.img.src)
  .pipe(image({
    pngquant: true,
    optipng: true,
    zopflipng: true,
    jpegRecompress: false,
    mozjpeg: true,
    gifsicle: true,
    svgo: true,
    concurrent: 1,
  }))
  .pipe(dest(path.img.build))
  .pipe(browserSync.stream());

// Task SASS Precompile
export const styles = () => src(path.styles.src)
  .pipe(sass())
  .pipe(cleanCSS())
  .pipe(rename({
    suffix: '.min',
  }))
  .pipe(dest(path.styles.build))
  .pipe(browserSync.stream());

// Task JS Precompile
export const scripts = () => src(path.scripts.src, {
  sourcemaps: true,
})
  .pipe(babel())
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min',
  }))
  .pipe(dest(path.scripts.build))
  .pipe(browserSync.stream());

// Task Import Fonts
export const fonts = () => src(path.font.src).pipe(dest(path.font.build));

// Task Import Icons
export const icons = () => src(path.icon.src).pipe(dest(path.icon.build));

// Task Clean All Build
export const clean = () => del(['./dest/*']);

// Task Precompile project
export const build = series(clean, parallel(views, styles, scripts, fonts, icons, imgs));

// Task server developer
export const server = () => {
  browserSync.create();
  browserSync.init({
    watch: true,
    server: {
      baseDir: path.build,
    },
  });

  watch([...path.views.src]).on('change', parallel(views, browserSync.reload));
  watch([...path.styles.src]).on('change', parallel(styles, browserSync.reload));
  watch([...path.scripts.src]).on('change', parallel(scripts, browserSync.reload));
  watch([...path.img.src]).on('change', parallel(imgs, browserSync.reload));
  watch([...path.font.src]).on('change', parallel(fonts, browserSync.reload));
  watch([...path.icon.src]).on('change', parallel(icons, browserSync.reload));
};

export default server;
