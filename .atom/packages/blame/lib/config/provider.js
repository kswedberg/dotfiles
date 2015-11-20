module.exports = [{
  // Bitbucket
  exps: [
    /^git@(bitbucket\.org):([^\/]+)\/([^\/\.]+)\.git$/,
    /^https:\/\/(bitbucket\.org)\/([^\/]+)\/([^\/\.]+)(\.git)?$/,
    /^https:\/\/.+@(bitbucket\.org)\/([^\/]+)\/([^\/\.]+)(\.git)?$/
  ],
  template: "https://{host}/{user}/{repo}/commits/{hash}"
},{
  // Generic (Github, GitLab and others)
  exps: [
    /^git@(.*):(.+)\/(.+)\.git$/,
    /^https?:\/\/([^@\/]+)\/([^\/]+)\/([^\/\.]+)(\.git)?$/,
    /^https?:\/\/.+@([^\/]+)\/([^\/]+)\/([^\/\.]+)(\.git)?$/
  ],
  template: "https://{host}/{user}/{repo}/commit/{hash}"
}]
