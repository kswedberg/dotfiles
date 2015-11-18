(function() {
  module.exports = {
    name: "Perl",
    namespace: "perl",

    /*
    Supported Grammars
     */
    grammars: ["Perl", "Perl 6"],

    /*
    Supported extensions
     */
    extensions: ["pl"],
    options: {
      perltidy_profile: {
        type: 'string',
        "default": "",
        description: "Specify a configuration file which will override the default name of .perltidyrc"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvcGVybC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUVmLElBQUEsRUFBTSxNQUZTO0FBQUEsSUFHZixTQUFBLEVBQVcsTUFISTtBQUtmO0FBQUE7O09BTGU7QUFBQSxJQVFmLFFBQUEsRUFBVSxDQUNSLE1BRFEsRUFDQSxRQURBLENBUks7QUFZZjtBQUFBOztPQVplO0FBQUEsSUFlZixVQUFBLEVBQVksQ0FDVixJQURVLENBZkc7QUFBQSxJQW1CZixPQUFBLEVBQ0U7QUFBQSxNQUFBLGdCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLGtGQUZiO09BREY7S0FwQmE7R0FBakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/languages/perl.coffee
