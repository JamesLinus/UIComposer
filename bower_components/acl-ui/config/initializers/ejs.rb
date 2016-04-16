# NOTE: By default EJS treats `<%= foo %>` as an equivalent to ERB's `<%= raw foo %>`. This is error-prone, confusing and hard to spot in pull requests having both ejs and erb files. Hence the change.
EJS.escape_pattern = /<%=([^=][\s\S]*?)%>/
EJS.interpolation_pattern = /<%==([\s\S]+?)%>/
