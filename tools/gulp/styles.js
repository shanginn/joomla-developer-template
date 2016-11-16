import gulp from 'gulp';
import gutil from 'gulp-util';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import postcss from 'gulp-postcss';
import mqpacker from 'css-mqpacker';
import postcssFixies from 'postcss-fixes';
import autoprefixer from 'autoprefixer';
import postcssAssets from 'postcss-assets';
import postcssInitial from 'postcss-initial';
import postcssWillChange from 'postcss-will-change';
import postcssEasings from 'postcss-easings';
import csso from 'gulp-csso';
import { styles as config } from '../config';
import afterCompleteTaskCb from './utils/afterCompleteTaskCb';

const commonProcessors = [
  postcssInitial(config.postcss.initial),
  postcssFixies,
  postcssWillChange,
  postcssEasings,
  postcssAssets(config.postcss.assets),
  autoprefixer(config.postcss.autoprefixer),
];

const processors = [
  ...commonProcessors,
  mqpacker(config.postcss.mqpacker),
];

const processorsDev = [
  ...commonProcessors,
];

export function styles() {
  return gulp.src(config.src)
    .pipe(sass(config.sass).on('error', sass.logError))
    .pipe(postcss(processors))
    .on('error', gutil.log)
    .pipe(csso())
    .pipe(rename({ basename: `${config.resultFilename}.min` }))
    .pipe(gulp.dest(config.dest))
    .pipe(afterCompleteTaskCb());
}

export function stylesDev() {
  return gulp.src(config.src)
    .pipe(sourcemaps.init())
    .pipe(sass(config.sass).on('error', sass.logError))
    .pipe(postcss(processorsDev))
    .on('error', gutil.log)
    .pipe(sourcemaps.write())
    .pipe(rename({ basename: config.resultFilename }))
    .pipe(gulp.dest(config.dest))
    .pipe(afterCompleteTaskCb());
}

gulp.task('styles', styles);
gulp.task('styles:dev', stylesDev);

export function stylesWatch() {
  gulp.watch(config.watch, styles);
}

export function stylesDevWatch() {
  gulp.watch(config.watch, stylesDev);
}

gulp.task('styles:watch', stylesWatch);
gulp.task('styles:dev:watch', stylesDevWatch);
