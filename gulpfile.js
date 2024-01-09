/*
 Запустите: `  npm install `

Внимание! Эта сборка для gulp v4 и выше, для v3.9 возьмите другую

 Для начала работы и написания кода, нужно дать команду   ` gulp `


*Все, автообновление работает.
При редактировании любых файлов, браузер будет автоматически обновляться.*


 На JavaScript можно писать используя синтаксис ES6


 Команды для запуска:
- gulp dev     - осуществит сборку проекта для РАБОТЫ, с MAP-файлами
- gulp build   - осуществит сборку проекта для продакшена, появится папка "dist" уровнем выше (ее размещаем на хостинге)


 в папке `app` - находятся файлы для работы. Именно там их нужно РЕДАКТИРОВАТЬ !


*/
var path = {
    dist: {
        html:  'dist/',
        js:    'dist/js',
        css:   'dist/css',
        images:   'dist/images',
        fonts: 'dist/fonts',
        libs: 'dist/libs'
    },
    src: {
        html:   'src/*.html',
        js:     'src/js/*.js',
        scss:   'src/scss/*.scss',
        css:   'src/css',
        images: 'src/images/*.*',
        fonts:  'src/fonts/*.*'
    },
    watch: {
        html:   'watch/*.html',
        js:     'watch/js',
        css:   'watch/css',
        images: 'watch/images',
        fonts:  'watch/fonts'
    },
    clean:     'dist'
};


/* подключаем gulp и плагины */
const gulp = require('gulp'), // подключаем Gulp
    sass = require('gulp-sass')(require('sass')), // модуль для компиляции SASS (SCSS) в CSS
    autoprefixer = require('autoprefixer'), // модуль для автоматической установки автопрефиксов
    postcss = require('gulp-postcss'),
    browserSync = require('browser-sync').create(), // сервер для работы и автоматического обновления страниц
    plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
    uglify = require('gulp-uglify'), // модуль для минимизации JavaScript
    sourcemaps = require('gulp-sourcemaps'), // модуль для генерации карты исходных файлов
    cleanCSS = require('gulp-clean-css'), // плагин для минимизации CSS
    minifyCss = require('gulp-minify-css'),
    gulpif = require('gulp-if'),
    // imagemin = require('gulp-imagemin'), // плагин для сжатия PNG, JPEG, GIF и SVG изображений
    jpegrecompress = require('imagemin-jpeg-recompress'), // плагин для сжатия jpeg
    pngquant = require('imagemin-pngquant'), // плагин для сжатия png
    del = require('del'),
    babel = require('gulp-babel'), //преобразование скриптов с поддержкой ES6
    pug = require('gulp-pug');


gulp.task('sass', function (cb) {
    return gulp.src(path.src.scss)
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(sass()) // scss -> css
        // .pipe(postcss([ autoprefixer() ]))
        .pipe(cleanCSS()) // минимизируем CSS
        .pipe(gulp.dest(path.watch.css))  // выкладывание готовых файлов
        .pipe(browserSync.stream());
    cb();
});

gulp.task('sass:build', function (cb) {
    return gulp.src(path.src.scss)
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(sass()) // scss -> css
        .pipe(postcss([ autoprefixer() ]))
        .pipe(cleanCSS()) // минимизируем CSS
        .pipe(gulp.dest(path.dist.css))  // выкладывание готовых файлов
        .pipe(browserSync.stream());
    cb();
});

gulp.task('pug', function (done) {
    gulp.src('src/pages/*.+(jade|pug)')
        .pipe(pug({pretty: '\t'}))
        .pipe(gulp.dest('watch/'))
        .pipe(browserSync.stream());
    done();
});

gulp.task('pug:build', function (done) {
    gulp.src('src/pages/*.+(jade|pug)')
        .pipe(pug({pretty: '\t'}))
        .pipe(gulp.dest('dist/'));
    done();
});


gulp.task('watch', function(cb) {
    browserSync.init({
        server: './dist'
    });
    gulp.watch('src/scss/*.scss', gulp.series('sass')).on('change', browserSync.reload); //.on('change',browserSync.reload);
    gulp.watch('src/components/*/*.scss', gulp.series('sass')).on('change', browserSync.reload); //.on('change',browserSync.reload);
    gulp.watch('src/js/*.js').on('change', browserSync.reload);
    gulp.watch('src/pages/**/*.+(jade|pug)', gulp.series('pug')).on('change', browserSync.reload);
    cb();
});

gulp.task('watch:start', function(cb) {
    browserSync.init({
        server: './watch'
    });
    gulp.watch('src/scss/*.scss', gulp.series('sass')).on('change', browserSync.reload); //.on('change',browserSync.reload);
    gulp.watch('src/scss/*/*.scss', gulp.series('sass')).on('change', browserSync.reload); //.on('change',browserSync.reload);
    gulp.watch('src/components/*/*.scss', gulp.series('sass')).on('change', browserSync.reload); //.on('change',browserSync.reload);
    gulp.watch('src/js/*.js').on('change', browserSync.reload);
    gulp.watch('src/pages/*.+(jade|pug)', gulp.series('pug')).on('change', browserSync.reload);
    gulp.watch('src/components/**/*.+(jade|pug)', gulp.series('pug')).on('change', browserSync.reload);
    cb();
});

gulp.task('script', (cb) => {  //сжатие скриптов с поддержкой ES6
    return gulp.src(path.src.js)
        // .pipe(babel({
        //     presets: ['@babel/env']
        // }))
        // .pipe(uglify())
        .pipe(gulp.dest(path.watch.js))
        .pipe(browserSync.stream());
    cb();
});

gulp.task('script:build', (cb) => {  //сжатие скриптов с поддержкой ES6
    return gulp.src(path.src.js)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(path.dist.js))
    cb();
});

gulp.task('images:build', function (cb) {
    gulp.src(path.src.images) // путь с исходниками картинок
        // .pipe(cache(imagemin([ // сжатие изображений
        //     // imagemin.gifsicle({interlaced: true}),
        //     jpegrecompress({
        //         progressive: true,
        //         max: 90,
        //         min: 80
        //     }),
        //     pngquant(),
        //     // imagemin.svgo({plugins: [{removeViewBox: false}]})
        // ])))
        .pipe(gulp.dest(path.dist.images)); // выгрузка готовых файлов
    cb();
});


gulp.task('images', function (cb) {
    gulp.src(path.src.images) // путь с исходниками картинок
        // .pipe(cache(imagemin([ // сжатие изображений
        //     // imagemin.gifsicle({interlaced: true}),
        //     jpegrecompress({
        //         progressive: true,
        //         max: 90,
        //         min: 80
        //     }),
        //     pngquant(),
        //     // imagemin.svgo({plugins: [{removeViewBox: false}]})
        // ])))
        .pipe(gulp.dest(path.watch.images)); // выгрузка готовых файлов
    cb();
});


gulp.task('fonts:build', function () {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.dist.fonts))
});

gulp.task('fonts', function () {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.watch.fonts))
});

gulp.task('clean', function (cb) {
    del('dist');
    cb();
});

gulp.task('clean:watch', function (cb) {
    del('watch');
    cb();
});

gulp.task('dev', gulp.series('watch'));

gulp.task('start', gulp.series('clean:watch', 'sass', 'images', 'fonts', 'script', 'pug', 'watch:start'));

gulp.task('build', gulp.series('clean', 'sass:build', 'images:build', 'fonts:build', 'script:build', 'pug:build', function (done) {
    done();
}));
