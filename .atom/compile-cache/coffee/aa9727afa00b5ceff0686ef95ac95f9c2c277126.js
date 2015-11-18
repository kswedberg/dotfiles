(function() {
  module.exports = {
    allowLocalOverride: {
      description: 'Allow .languagebabel files to overide the settings below. Useful for project based configurations.',
      type: 'boolean',
      "default": false,
      order: 30
    },
    transpileOnSave: {
      description: 'Check source code validity on file save. Use "Create Transpiled Code" option below to save file.',
      type: 'boolean',
      "default": false,
      order: 40
    },
    createTranspiledCode: {
      description: 'Save transpiled code to Babel Transpile Path below.',
      type: 'boolean',
      "default": false,
      order: 50
    },
    disableWhenNoBabelrcFileInPath: {
      description: 'Suppress transpile when no .babelrc file is in source file path.',
      type: 'boolean',
      "default": true,
      order: 60
    },
    suppressTranspileOnSaveMessages: {
      description: 'Suppress non-error notification messages on each save.',
      type: 'boolean',
      "default": true,
      order: 70
    },
    suppressSourcePathMessages: {
      description: 'Suppress messages about file not being inside Babel Source Path.',
      type: 'boolean',
      "default": true,
      order: 75
    },
    createMap: {
      description: 'Create seperate map file.',
      type: 'boolean',
      "default": false,
      order: 80
    },
    babelMapsAddUrl: {
      description: 'Append map file name to transpiled output if "Create seperate map file" is set.',
      type: 'boolean',
      "default": true,
      order: 90
    },
    babelSourcePath: {
      description: 'Babel Source Root based on Project root.',
      type: 'string',
      "default": '',
      order: 100
    },
    babelTranspilePath: {
      description: 'Babel Transpile Root based on Project root.',
      type: 'string',
      "default": '',
      order: 120
    },
    babelMapsPath: {
      description: 'Babel Maps Root based on Project root.',
      type: 'string',
      "default": '',
      order: 130
    },
    createTargetDirectories: {
      description: 'Create transpile output target directories.',
      type: 'boolean',
      "default": true,
      order: 140
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1iYWJlbC9saWIvY29uZmlnLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxrQkFBQSxFQUNFO0FBQUEsTUFBQSxXQUFBLEVBQWEsb0dBQWI7QUFBQSxNQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsS0FGVDtBQUFBLE1BR0EsS0FBQSxFQUFPLEVBSFA7S0FERjtBQUFBLElBS0EsZUFBQSxFQUNFO0FBQUEsTUFBQSxXQUFBLEVBQWEsa0dBQWI7QUFBQSxNQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsS0FGVDtBQUFBLE1BR0EsS0FBQSxFQUFPLEVBSFA7S0FORjtBQUFBLElBVUEsb0JBQUEsRUFDRTtBQUFBLE1BQUEsV0FBQSxFQUFhLHFEQUFiO0FBQUEsTUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLE1BRUEsU0FBQSxFQUFTLEtBRlQ7QUFBQSxNQUdBLEtBQUEsRUFBTyxFQUhQO0tBWEY7QUFBQSxJQWVBLDhCQUFBLEVBQ0U7QUFBQSxNQUFBLFdBQUEsRUFBYSxrRUFBYjtBQUFBLE1BQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxNQUVBLFNBQUEsRUFBUyxJQUZUO0FBQUEsTUFHQSxLQUFBLEVBQU8sRUFIUDtLQWhCRjtBQUFBLElBb0JBLCtCQUFBLEVBQ0U7QUFBQSxNQUFBLFdBQUEsRUFBYSx3REFBYjtBQUFBLE1BQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxNQUVBLFNBQUEsRUFBUyxJQUZUO0FBQUEsTUFHQSxLQUFBLEVBQU8sRUFIUDtLQXJCRjtBQUFBLElBeUJBLDBCQUFBLEVBQ0U7QUFBQSxNQUFBLFdBQUEsRUFBYSxrRUFBYjtBQUFBLE1BQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxNQUVBLFNBQUEsRUFBUyxJQUZUO0FBQUEsTUFHQSxLQUFBLEVBQU8sRUFIUDtLQTFCRjtBQUFBLElBOEJBLFNBQUEsRUFDRTtBQUFBLE1BQUEsV0FBQSxFQUFhLDJCQUFiO0FBQUEsTUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLE1BRUEsU0FBQSxFQUFTLEtBRlQ7QUFBQSxNQUdBLEtBQUEsRUFBTyxFQUhQO0tBL0JGO0FBQUEsSUFtQ0EsZUFBQSxFQUNFO0FBQUEsTUFBQSxXQUFBLEVBQWEsaUZBQWI7QUFBQSxNQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsSUFGVDtBQUFBLE1BR0EsS0FBQSxFQUFPLEVBSFA7S0FwQ0Y7QUFBQSxJQXdDQSxlQUFBLEVBQ0U7QUFBQSxNQUFBLFdBQUEsRUFBYSwwQ0FBYjtBQUFBLE1BQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxNQUVBLFNBQUEsRUFBUyxFQUZUO0FBQUEsTUFHQSxLQUFBLEVBQU8sR0FIUDtLQXpDRjtBQUFBLElBNkNBLGtCQUFBLEVBQ0U7QUFBQSxNQUFBLFdBQUEsRUFBYSw2Q0FBYjtBQUFBLE1BQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxNQUVBLFNBQUEsRUFBUyxFQUZUO0FBQUEsTUFHQSxLQUFBLEVBQU8sR0FIUDtLQTlDRjtBQUFBLElBa0RBLGFBQUEsRUFDRTtBQUFBLE1BQUEsV0FBQSxFQUFhLHdDQUFiO0FBQUEsTUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLE1BRUEsU0FBQSxFQUFTLEVBRlQ7QUFBQSxNQUdBLEtBQUEsRUFBTyxHQUhQO0tBbkRGO0FBQUEsSUF1REEsdUJBQUEsRUFDRTtBQUFBLE1BQUEsV0FBQSxFQUFhLDZDQUFiO0FBQUEsTUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLE1BRUEsU0FBQSxFQUFTLElBRlQ7QUFBQSxNQUdBLEtBQUEsRUFBTyxHQUhQO0tBeERGO0dBREYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/language-babel/lib/config.coffee
