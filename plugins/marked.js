const marked = require('marked');

module.exports = {
  processMarkdown(input) {
    return marked(input);
  }
};