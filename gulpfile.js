var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var browserSync = require('browser-sync').create();


var bases = {
    app: 'app/',
    dist: 'webapp/',
    distServer: '/Applications/XAMPP/xamppfiles/htdocs/sediapNew'
};

var paths = {
    //Incluiremos todos los componentes dentro de app, exceptuando la carpeta lib (administrada por bower)
    appJs: ['app/**/*.js'],
    //Direccion de las librerias, estas las copiaremos integramente
    libs: [
        'js/jquery-3.2.1.min.js',
        'js/materialize.js'
    ],
    //Ubicacion de los archivos de estilos que minificaremos
    styles: [
        'css/material-icons.css',
        'css/materialize.css'
    ],
    //los archivos html que incluiremos en la minificacion
    htmls: ['views/*.html'],
    //La ruta de las imagenes que minificaremos
    images: 'images/**/*.{png,jpg,jpeg,gif,svg}',
    //Ruta de fuente
    font:'fonts/**/*',
    //Otros extras
    extras: []
};

gulp.task('clean', function () {
    return gulp.src(bases.dist)
        .pipe(clean());
});

gulp.task('images', function () {
    return gulp.src(paths.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest(bases.dist + '/images'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('copy:estilo', function () {
    return gulp.src(paths.styles)
        .pipe(minifyCSS())
        .pipe(concat('estilos.min.css'))
        .pipe(gulp.dest(bases.dist + '/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('copy:fonts', function () {
    return gulp.src(paths.font)
        .pipe(gulp.dest(bases.dist + '/fonts'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('copy:vendor', function () {
    return gulp.src(paths.libs)
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('webapp/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('copy:index', function () {
    return gulp.src('index.html')
        .pipe(gulp.dest('webapp/'))
        .pipe(browserSync.reload({
            stream: true
        }));

});

gulp.task('copy:htmls', function () {
    return gulp.src(paths.htmls)
        .pipe(gulp.dest('webapp/view/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('copy:app', function () {
    return gulp.src(paths.appJs)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat(('app.min.js')))
        .pipe(gulp.dest('webapp/js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'webapp'
        }
    })
});

gulp.task('default', ['browserSync', 'images', 'copy:estilo', 'copy:fonts', 'copy:vendor', 'copy:index', 'copy:htmls', 'copy:app'], function () {
    gulp.watch(paths.images, ['images']);
    gulp.watch(paths.styles, ['copy:estilo']);
    gulp.watch(paths.appJs, ['copy:app']);
    gulp.watch('index.html', ['copy:index']);
    gulp.watch(paths.htmls, ['copy:htmls']);
});