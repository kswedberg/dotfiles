(function() {
  module.exports = [
    {
      exps: [/^git@(bitbucket\.org):([^\/]+)\/([^\/\.]+)\.git$/, /^https:\/\/(bitbucket\.org)\/([^\/]+)\/([^\/\.]+)(\.git)?$/, /^https:\/\/.+@(bitbucket\.org)\/([^\/]+)\/([^\/\.]+)(\.git)?$/],
      template: "https://{host}/{user}/{repo}/commits/{hash}"
    }, {
      exps: [/^git@(.*):(.+)\/(.+)\.git$/, /^https?:\/\/([^@\/]+)\/([^\/]+)\/([^\/\.]+)(\.git)?$/, /^https?:\/\/.+@([^\/]+)\/([^\/]+)\/([^\/\.]+)(\.git)?$/],
      template: "https://{host}/{user}/{repo}/commit/{hash}"
    }
  ];

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9ibGFtZS9saWIvY29uZmlnL3Byb3ZpZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUFDO0FBQUEsTUFFaEIsSUFBQSxFQUFNLENBQ0osa0RBREksRUFFSiw0REFGSSxFQUdKLCtEQUhJLENBRlU7QUFBQSxNQU9oQixRQUFBLEVBQVUsNkNBUE07S0FBRCxFQVFmO0FBQUEsTUFFQSxJQUFBLEVBQU0sQ0FDSiw0QkFESSxFQUVKLHNEQUZJLEVBR0osd0RBSEksQ0FGTjtBQUFBLE1BT0EsUUFBQSxFQUFVLDRDQVBWO0tBUmU7R0FBakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/dotfiles/.atom/packages/blame/lib/config/provider.coffee
