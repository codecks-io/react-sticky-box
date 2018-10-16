const gulp = require("gulp");
const awspublish = require("gulp-awspublish");
const awspublishRouter = require("gulp-awspublish-router");
const cloudfront = require("gulp-cloudfront-invalidate-aws-publish");
const exec = require("@danielberndt/exec");
const parallelize = require("concurrent-transform");

const CONFIG = {
  dist: "./.docz/dist",
  favicon: "./docs/favicon.ico",
  robots: "./docs/robots.txt",
};

gulp.task("build", () => exec("yarn docz:build"));
gulp.task("build-and-move-assets", ["build"], () => {
  return gulp.src([CONFIG.favicon, CONFIG.robots]).pipe(gulp.dest(CONFIG.dist));
});

const deployCmd = envFile => () => {
  if (envFile) require("dotenv").config({path: envFile});
  const publisher = awspublish.create({
    params: {Bucket: process.env.S3_BUCKET},
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  return (
    gulp
      .src([`${CONFIG.dist}/**`])
      .pipe(
        awspublishRouter({
          cache: {
            // cache for 20 years by default
            cacheTime: 630720000,
          },
          routes: {
            "^.+\\.(html|json|txt|ico)$": {
              cacheTime: 900,
            },
            "^.*assets\\.json$": {
              cacheTime: 900,
            },
            "^.+$": "$&",
          },
        })
      )
      .pipe(parallelize(publisher.publish(), 10))
      // .pipe(publisher.sync()) uncomment to delete old files
      .pipe(
        cloudfront({
          distribution: process.env.CLOUDFRONT_ID,
          indexRootPath: true,
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        })
      )
      .pipe(publisher.cache())
      .pipe(awspublish.reporter())
  );
};

gulp.task("load-env");
gulp.task("deploy", ["build-and-move-assets"], deployCmd(".env"));
gulp.task("deploy-from-ci", ["build-and-move-assets"], deployCmd());
