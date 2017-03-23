/* Dependencias */
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    ts = require('gulp-typescript'),
    tsProject = ts.createProject('tsconfig.json'),
    browserSync = require('browser-sync');



/*Limpiar de contenido la carpeta dist*/
gulp.task('limpiar_dist', function (cb) {
    del([
    'dist/**','!dist'
    ], cb);
});

/*Copia de los archivos index.html y carpetas vendor y data dentro de la carpeta dist*/
gulp.task('copy_indexHTML',function(){
    gulp.src('src/index.html')
    .pipe(gulp.dest('dist/'));
})

gulp.task('copy_vendor', function () {
    gulp.src('src/vendor/*.*')
    .pipe(gulp.dest('dist/')),
    gulp.src('src/vendor/**')
    .pipe(gulp.dest('dist/vendor/'));
})

gulp.task('copy_data', function () {
    gulp.src('src/data')
    .pipe(gulp.dest('dist/')),
    gulp.src('src/data/**')
    .pipe(gulp.dest('dist/data/'));
})

gulp.task('copy_index_vendor_data', ['copy_indexHTML', 'copy_vendor', 'copy_data']);


/*Se minifican las imagenes de la carpeta src/img y se copian en dist/img*/
gulp.task('copy_pictures', function () {
    return gulp.src(['src/img/*.*'])
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img/'));
});

/*Conversion de SASS a CSS con sourcemaps*/
gulp.task('sass', function () {
    return gulp.src('src/sass/*.scss')
     .pipe(sourcemaps.init())
        .pipe(sass())
     .pipe(sourcemaps.write('/maps/'))
     .pipe(gulp.dest('dist/cs/'));
});

/*Transpilación de typescript*/
gulp.task('scripts', function () {
    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
            .pipe(tsProject());
    return tsResult.js
        .pipe(uglify())
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest('dist/js'));
});

/*Servir la aplicación*/
gulp.task('build', ['copy_index_vendor_data','copy_pictures','watch']);


gulp.task('watch', function () { /*recarga de los archivos html,ts y scss*/
    browserSync({
        server: {
            baseDir: './src/'            
        }
    });

    gulp.watch('src/*.html', ['html-watch']);
    gulp.watch('src/ts/*.ts', ['scripts-watch']);
    gulp.watch('src/sass/*scss', ['sass-watch']);

})

gulp.task('sass-watch', ['sass'], browserSync.reload);
gulp.task('html-watch', ['html'], browserSync.reload);
gulp.task('scripts-watch', ['scripts'], browserSync.reload);


gulp.task('html', function () {
    return gulp.src('./src/*.html')
    .pipe(gulp.dest('dist/'))
});


/*Tarea por defecto*/
gulp.task('default', ['limpiar_dist', 'build']);