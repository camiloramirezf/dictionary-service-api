const gutil = require('gulp-util')
const zip = require('gulp-archiver')
const run = require('gulp-run')
const gulp = require('gulp-help')(require('gulp'))
const del = require('del')
const { env } = require('process')
const localenv = require('gulp-env')
const kudu = require('kudu-api')

const buildDir = './build';

gulp.task('setvars', function(){
    localenv({
        vars: {
            AZURE_TARGETSLOT: "vocabulary-functions-test",
            AZUREDEVCREDS_USR: "$vocabulary-functions__test",
            AZUREDEVCREDS_PSW: "WhqtSZYqYlnCiPRhJLyJGbcykQDavdjLsi3heArAe8a7XqRz05yinG3eoXs1",           
        }
    })
})

gulp.task('delete:zip', () => {
    return del(`${buildDir}/app.zip`)
})

gulp.task('zip', ['delete:zip'], () => {
    return gulp.src([`./**/*`,'!./node_modules', '!./node_modules/**/*'], {dot: true})
        .pipe(zip('app.zip'))
        .pipe(gulp.dest(buildDir))
})

gulp.task('deploy:local', ['setvars', 'zip'], done => {
    const targetEnv = {
        slot: env.AZURE_TARGETSLOT,
        username: env.AZUREDEVCREDS_USR,
        password: env.AZUREDEVCREDS_PSW
      }
          
      if (!targetEnv.slot) {
        throw new Error('Azure target environment is not defined')
      }
      if (!targetEnv.username) throw new Error('Azure username is not defined')
      if (!targetEnv.password) throw new Error('Azure password is not defined')
    
      const kuduApi = kudu({
        website: targetEnv.slot,
        username: targetEnv.username,
        password: targetEnv.password
      })
    
      gutil.log(`Deleting current deployment of ${targetEnv.slot}...`)
      kuduApi.vfs.deleteDirectory('site/wwwroot', delErr => {
        if (delErr) return done(delErr)
    
        kuduApi.vfs.createDirectory('site/wwwroot', createDirErr => {
          if (createDirErr) return done(createDirErr)
    
          gutil.log(`Deploying zipped app to ${targetEnv.slot}...`)
          kuduApi.zip.upload(`${buildDir}/app.zip`, 'site/wwwroot', deployErr => {
            if(deployErr) return done(deployErr);
            gutil.log('Uploading app.zip successful');
            return done()
          })
        })
      })
})