export const baseConfig = {
  serverType: process.env.VUE_APP_BASE_ENV == 'prod' ? 1 : 0,
  prefixReportUrl: '',
  appId: '',
  clientVersion: '',
  identification: ''
}