module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true
  },
  'ignorePatterns': ['node_modules', 'public'],
  'extends': [
    'plugin:vue/essential',
    'standard'
  ],
  'parserOptions': {
    'ecmaVersion': 12
  },
  'plugins': [
    'vue'
  ],
  'rules': {
    'quote-props': ['error', 'always']
  }
}
