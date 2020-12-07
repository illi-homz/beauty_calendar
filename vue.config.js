module.exports = {
  "css": {
    "loaderOptions": {
      "sass": {
        "prependData": "@import \"~@/assets/style/style.scss\""
      },
      "scss": {
        "prependData": "@import \"~@/assets/style/style.scss\";"
      }
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}