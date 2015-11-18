(function() {
  module.exports = {
    name: "Objective-C",
    namespace: "objectivec",
    fallback: [],

    /*
    Supported Grammars
     */
    grammars: ["Objective-C", "Objective-C++"],

    /*
    Supported extensions
     */
    extensions: ["m", "mm", "h"],
    options: {
      configPath: {
        title: "Config Path",
        type: 'string',
        "default": "",
        description: "Path to uncrustify config file. i.e. uncrustify.cfg"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvb2JqZWN0aXZlLWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQUEsSUFFZixJQUFBLEVBQU0sYUFGUztBQUFBLElBR2YsU0FBQSxFQUFXLFlBSEk7QUFBQSxJQUlmLFFBQUEsRUFBVSxFQUpLO0FBTWY7QUFBQTs7T0FOZTtBQUFBLElBU2YsUUFBQSxFQUFVLENBQ1IsYUFEUSxFQUVSLGVBRlEsQ0FUSztBQWNmO0FBQUE7O09BZGU7QUFBQSxJQWlCZixVQUFBLEVBQVksQ0FDVixHQURVLEVBRVYsSUFGVSxFQUdWLEdBSFUsQ0FqQkc7QUFBQSxJQXVCZixPQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLGFBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsRUFGVDtBQUFBLFFBR0EsV0FBQSxFQUFhLHFEQUhiO09BREY7S0F4QmE7R0FBakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/languages/objective-c.coffee
