(function() {
  var cheerio, compareHTML, markdownIt, renderMath;

  markdownIt = require('../lib/markdown-it-helper');

  cheerio = require('cheerio');

  require('./spec-helper');

  renderMath = false;

  compareHTML = function(one, two) {
    one = markdownIt.render(one, renderMath);
    one = one.replace(/\n\s*/g, '');
    two = two.replace(/\n\s*/g, '');
    return expect(one).toEqual(two);
  };

  describe("MarkdownItHelper (Math)", function() {
    var content;
    content = [][0];
    beforeEach(function() {
      content = null;
      return renderMath = true;
    });
    it("Math in markdown inlines", function() {
      var result;
      content = "# Math $x^2$ in heading 1\n\n_math $x^2$ in emphasis_\n\n**math $x^2$ in bold**\n\n[math $x^2$ in link](http://www.mathjax.org/)\n\n`math $x^2$ in code`\n\n~~math $x^2$ in strikethrough~~";
      result = "<h1>Math <span class='math'><script type='math/tex'>x^2</script></span> in heading 1</h1>\n<p><em>math <span class='math'><script type='math/tex'>x^2</script></span> in emphasis</em></p>\n<p><strong>math <span class='math'><script type='math/tex'>x^2</script></span> in bold</strong></p>\n<p><a href=\"http://www.mathjax.org/\">math <span class='math'><script type='math/tex'>x^2</script></span> in link</a></p>\n<p><code>math $x^2$ in code</code></p>\n<p><s>math <span class='math'><script type='math/tex'>x^2</script></span> in strikethrough</s></p>";
      return compareHTML(content, result);
    });
    describe("Interference with markdown syntax (from issue-18)", function() {
      it("should not interfere with *", function() {
        return runs(function() {
          var result;
          content = "This $(f*g*h)(x)$ is no conflict";
          result = "<p>This <span class='math'><script type='math/tex'>(f*g*h)(x)</script></span> is no conflict</p>";
          return compareHTML(content, result);
        });
      });
      it("should not interfere with _", function() {
        return runs(function() {
          var result;
          content = "This $x_1, x_2, \\dots, x_N$ is no conflict";
          result = "<p>This <span class='math'><script type='math/tex'>x_1, x_2, \\dots, x_N</script></span> is no conflict</p>";
          return compareHTML(content, result);
        });
      });
      return it("should not interfere with link syntax", function() {
        return runs(function() {
          var result;
          content = "This $[a+b](c+d)$ is no conflict";
          result = "<p>This <span class='math'><script type='math/tex'>[a+b](c+d)</script></span> is no conflict</p>";
          return compareHTML(content, result);
        });
      });
    });
    describe("Examples from stresstest document (issue-18)", function() {
      it("several tex functions", function() {
        return runs(function() {
          var result;
          content = "$k \\times k$, $n \\times 2$, $2 \\times n$, $\\times$\n\n$x \\cdot y$, $\\cdot$\n\n$\\sqrt{x^2+y^2+z^2}$\n\n$\\alpha \\beta \\gamma$\n\n$$\n\\begin{aligned}\nx\\ &= y\\\\\nmc^2\\ &= E\n\\end{aligned}\n$$";
          result = "<p><span class='math'><script type='math/tex'>k \\times k</script></span>, <span class='math'><script type='math/tex'>n \\times 2</script></span>, <span class='math'><script type='math/tex'>2 \\times n</script></span>, <span class='math'><script type='math/tex'>\\times</script></span></p>\n<p><span class='math'><script type='math/tex'>x \\cdot y</script></span>, <span class='math'><script type='math/tex'>\\cdot</script></span></p>\n<p><span class='math'><script type='math/tex'>\\sqrt{x^2+y^2+z^2}</script></span></p>\n<p><span class='math'><script type='math/tex'>\\alpha \\beta \\gamma</script></span></p>\n<span class='math'><script type='math/tex; mode=display'>\\begin{aligned}\nx\\ &= y\\\\\nmc^2\\ &= E\n\\end{aligned}\n</script></span>";
          return compareHTML(content, result);
        });
      });
      describe("Escaped Math environments", function() {
        xit("Empty lines after $$", function() {
          return runs(function() {
            var result;
            content = "$$\n\nshould be escaped\n\n$$";
            result = "<p>$$</p><p>should be escaped</p><p>$$</p>";
            return compareHTML(content, result);
          });
        });
        it("Inline Math without proper opening and closing", function() {
          return runs(function() {
            var result;
            content = "a $5, a $10 and a \\$100 Bill.";
            result = '<p>a $5, a $10 and a $100 Bill.</p>';
            return compareHTML(content, result);
          });
        });
        it("Double escaped \\[ and \\(", function() {
          return runs(function() {
            var result;
            content = "\n\\\\[\n  x+y\n\\]\n\n\\\\(x+y\\)";
            result = "<p>\\[x+y]</p><p>\\(x+y)</p>";
            return compareHTML(content, result);
          });
        });
        return it("In inline code examples", function() {
          return runs(function() {
            var result;
            content = "`\\$`, `\\[ \\]`, `$x$`";
            result = "<p><code>\\$</code>, <code>\\[ \\]</code>, <code>$x$</code></p>";
            return compareHTML(content, result);
          });
        });
      });
      return describe("Math Blocks", function() {
        it("$$ should work multiline", function() {
          return runs(function() {
            var result;
            content = "$$\na+b\n$$";
            result = "<span class='math'><script type='math/tex; mode=display'>a+b</script></span>";
            return compareHTML(content, result);
          });
        });
        it("$$ should work singeline", function() {
          return runs(function() {
            var result;
            content = "$$a+b$$";
            result = "<span class='math'><script type='math/tex; mode=display'>a+b</script></span>";
            return compareHTML(content, result);
          });
        });
        it("$$ should work directly after paragraph", function() {
          return runs(function() {
            var result;
            content = "Test\n$$\na+b\n$$";
            result = "<p>Test</p><span class='math'><script type='math/tex; mode=display'>a+b</script></span>";
            return compareHTML(content, result);
          });
        });
        it("\\[ should work multiline", function() {
          return runs(function() {
            var result;
            content = "\\[\na+b\n\\]";
            result = "<span class='math'><script type='math/tex; mode=display'>a+b</script></span>";
            return compareHTML(content, result);
          });
        });
        it("\\[ should work singeline", function() {
          return runs(function() {
            var result;
            content = "\\[a+b\\]";
            result = "<span class='math'><script type='math/tex; mode=display'>a+b</script></span>";
            return compareHTML(content, result);
          });
        });
        return it("\\[ should work directly after paragraph", function() {
          return runs(function() {
            var result;
            content = "Test\n\\[\na+b\n\\]";
            result = "<p>Test</p><span class='math'><script type='math/tex; mode=display'>a+b</script></span>";
            return compareHTML(content, result);
          });
        });
      });
    });
    return describe("Examples from issues", function() {
      it("should respect escaped dollar inside code (issue-3)", function() {
        return runs(function() {
          var result;
          content = "```\n\\$\n```";
          result = '<pre><code>\\$</code></pre>';
          return compareHTML(content, result);
        });
      });
      it("should respect escaped dollar inside code (mp-issue-116)", function() {
        return runs(function() {
          var result;
          content = "start\n\n```\n$fgf\n```\n\n\\$ asd\n$x$";
          result = "<p>start</p>\n<pre><code>$fgf</code></pre>\n<p>\n  $ asd\n  <span class='math'>\n    <script type='math/tex'>x</script>\n  </span>\n</p>";
          return compareHTML(content, result);
        });
      });
      it("should render inline math with \\( (issue-7)", function() {
        return runs(function() {
          var result;
          content = "This should \\(x+y\\) work.";
          result = "<p>\n This should <span class='math'>\n   <script type='math/tex'>x+y</script>\n </span> work.\n</p>";
          return compareHTML(content, result);
        });
      });
      it("should render inline math with N\\times N (issue-17)", function() {
        return runs(function() {
          var result;
          content = "An $N\\times N$ grid.";
          result = "<p>\n An <span class='math'>\n   <script type='math/tex'>N\\times N</script>\n </span> grid.\n</p>";
          return compareHTML(content, result);
        });
      });
      return it("should respect inline code (issue-20)", function() {
        return runs(function() {
          var result;
          content = "This is broken `$$`\n\n$$\na+b\n$$";
          result = "<p>This is broken <code>$$</code></p>\n<span class='math'>\n <script type='math/tex; mode=display'>\n   a+b\n </script>\n</span>";
          return compareHTML(content, result);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3LXBsdXMvc3BlYy9tYXJrZG93bi1wcmV2aWV3LXJlbmRlcmVyLW1hdGgtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNENBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLDJCQUFSLENBQWIsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsU0FBUixDQURWLENBQUE7O0FBQUEsRUFHQSxPQUFBLENBQVEsZUFBUixDQUhBLENBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsS0FMYixDQUFBOztBQUFBLEVBT0EsV0FBQSxHQUFjLFNBQUMsR0FBRCxFQUFNLEdBQU4sR0FBQTtBQUVaLElBQUEsR0FBQSxHQUFNLFVBQVUsQ0FBQyxNQUFYLENBQWtCLEdBQWxCLEVBQXVCLFVBQXZCLENBQU4sQ0FBQTtBQUFBLElBRUEsR0FBQSxHQUFNLEdBQUcsQ0FBQyxPQUFKLENBQVksUUFBWixFQUFzQixFQUF0QixDQUZOLENBQUE7QUFBQSxJQUlBLEdBQUEsR0FBTSxHQUFHLENBQUMsT0FBSixDQUFZLFFBQVosRUFBc0IsRUFBdEIsQ0FKTixDQUFBO1dBTUEsTUFBQSxDQUFPLEdBQVAsQ0FBVyxDQUFDLE9BQVosQ0FBb0IsR0FBcEIsRUFSWTtFQUFBLENBUGQsQ0FBQTs7QUFBQSxFQWlCQSxRQUFBLENBQVMseUJBQVQsRUFBb0MsU0FBQSxHQUFBO0FBQ2xDLFFBQUEsT0FBQTtBQUFBLElBQUMsVUFBVyxLQUFaLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLE9BQUEsR0FBVSxJQUFWLENBQUE7YUFDQSxVQUFBLEdBQWEsS0FGSjtJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFN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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-preview-plus/spec/markdown-preview-renderer-math-spec.coffee
