(function() {
  var Beautifiers, Handlebars, beautifier, beautifierName, beautifierOptions, beautifiers, context, exampleConfig, fs, languageOptions, linkifyTitle, optionDef, optionName, optionTemplate, optionTemplatePath, optionsPath, optionsTemplate, optionsTemplatePath, packageOptions, result, template, _i, _len, _ref;

  Handlebars = require('handlebars');

  Beautifiers = require("../src/beautifiers");

  fs = require('fs');

  console.log('Generating options...');

  beautifier = new Beautifiers();

  languageOptions = beautifier.options;

  packageOptions = require('../src/config.coffee');

  beautifierOptions = {};

  for (optionName in languageOptions) {
    optionDef = languageOptions[optionName];
    beautifiers = (_ref = optionDef.beautifiers) != null ? _ref : [];
    for (_i = 0, _len = beautifiers.length; _i < _len; _i++) {
      beautifierName = beautifiers[_i];
      if (beautifierOptions[beautifierName] == null) {
        beautifierOptions[beautifierName] = {};
      }
      beautifierOptions[beautifierName][optionName] = optionDef;
    }
  }

  console.log('Loading options template...');

  optionsTemplatePath = __dirname + '/options-template.md';

  optionTemplatePath = __dirname + '/option-template.md';

  optionsPath = __dirname + '/options.md';

  optionsTemplate = fs.readFileSync(optionsTemplatePath).toString();

  optionTemplate = fs.readFileSync(optionTemplatePath).toString();

  console.log('Building documentation from template and options...');

  Handlebars.registerPartial('option', optionTemplate);

  template = Handlebars.compile(optionsTemplate);

  linkifyTitle = function(title) {
    var p, sep;
    title = title.toLowerCase();
    p = title.split(/[\s,+#;,\/?:@&=+$]+/);
    sep = "-";
    return p.join(sep);
  };

  Handlebars.registerHelper('linkify', function(title, options) {
    return new Handlebars.SafeString("[" + (options.fn(this)) + "](\#" + (linkifyTitle(title)) + ")");
  });

  exampleConfig = function(option) {
    var c, d, json, k, namespace, t;
    t = option.type;
    d = (function() {
      switch (false) {
        case option["default"] == null:
          return option["default"];
        case t !== "string":
          return "";
        case t !== "integer":
          return 0;
        case t !== "boolean":
          return false;
        default:
          return null;
      }
    })();
    json = {};
    namespace = option.language.namespace;
    k = option.key;
    c = {};
    c[k] = d;
    json[namespace] = c;
    return "```json\n" + (JSON.stringify(json, void 0, 4)) + "\n```";
  };

  Handlebars.registerHelper('example-config', function(key, option, options) {
    var results;
    results = exampleConfig(key, option);
    return new Handlebars.SafeString(results);
  });

  context = {
    packageOptions: packageOptions,
    languageOptions: languageOptions,
    beautifierOptions: beautifierOptions
  };

  result = template(context);

  console.log('Writing documentation to file...');

  fs.writeFileSync(optionsPath, result);

  console.log('Done.');

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L2RvY3MvaW5kZXguY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBR0E7QUFBQSxNQUFBLDhTQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSLENBQWIsQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEsb0JBQVIsQ0FEZCxDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUlBLE9BQU8sQ0FBQyxHQUFSLENBQVksdUJBQVosQ0FKQSxDQUFBOztBQUFBLEVBS0EsVUFBQSxHQUFpQixJQUFBLFdBQUEsQ0FBQSxDQUxqQixDQUFBOztBQUFBLEVBTUEsZUFBQSxHQUFrQixVQUFVLENBQUMsT0FON0IsQ0FBQTs7QUFBQSxFQU9BLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHNCQUFSLENBUGpCLENBQUE7O0FBQUEsRUFTQSxpQkFBQSxHQUFvQixFQVRwQixDQUFBOztBQVVBLE9BQUEsNkJBQUE7NENBQUE7QUFDSSxJQUFBLFdBQUEsbURBQXNDLEVBQXRDLENBQUE7QUFDQSxTQUFBLGtEQUFBO3VDQUFBOztRQUNJLGlCQUFrQixDQUFBLGNBQUEsSUFBbUI7T0FBckM7QUFBQSxNQUNBLGlCQUFrQixDQUFBLGNBQUEsQ0FBZ0IsQ0FBQSxVQUFBLENBQWxDLEdBQWdELFNBRGhELENBREo7QUFBQSxLQUZKO0FBQUEsR0FWQTs7QUFBQSxFQWdCQSxPQUFPLENBQUMsR0FBUixDQUFZLDZCQUFaLENBaEJBLENBQUE7O0FBQUEsRUFpQkEsbUJBQUEsR0FBc0IsU0FBQSxHQUFZLHNCQWpCbEMsQ0FBQTs7QUFBQSxFQWtCQSxrQkFBQSxHQUFxQixTQUFBLEdBQVkscUJBbEJqQyxDQUFBOztBQUFB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

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/docs/index.coffee
