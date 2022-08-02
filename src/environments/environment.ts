// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  WebAPIUrl: 'http://localhost:3012/v1/',
  uploadsUrl: 'http://localhost:3012/uploads/',
  uploadedUrl: 'http://localhost:3012/uploads/photos/',

  frontendUrl: 'http://localhost:4200/',
  backendUrl: 'http://localhost:4200/admin/',
};
