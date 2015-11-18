(function() {
  var OurSide, Side, TheirSide,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Side = (function() {
    function Side(originalText, ref, marker, refBannerMarker, position) {
      this.originalText = originalText;
      this.ref = ref;
      this.marker = marker;
      this.refBannerMarker = refBannerMarker;
      this.position = position;
      this.conflict = null;
      this.isDirty = false;
      this.followingMarker = null;
    }

    Side.prototype.resolve = function() {
      return this.conflict.resolveAs(this);
    };

    Side.prototype.wasChosen = function() {
      return this.conflict.resolution === this;
    };

    Side.prototype.lineClass = function() {
      if (this.wasChosen()) {
        return 'conflict-resolved';
      } else if (this.isDirty) {
        return 'conflict-dirty';
      } else {
        return "conflict-" + (this.klass());
      }
    };

    Side.prototype.markers = function() {
      return [this.marker, this.refBannerMarker];
    };

    Side.prototype.toString = function() {
      var chosenMark, dirtyMark, text;
      text = this.originalText.replace(/[\n\r]/, ' ');
      if (text.length > 20) {
        text = text.slice(0, 18) + "...";
      }
      dirtyMark = this.isDirty ? ' dirty' : '';
      chosenMark = this.wasChosen() ? ' chosen' : '';
      return "[" + (this.klass()) + ": " + text + " :" + dirtyMark + chosenMark + "]";
    };

    return Side;

  })();

  OurSide = (function(_super) {
    __extends(OurSide, _super);

    function OurSide() {
      return OurSide.__super__.constructor.apply(this, arguments);
    }

    OurSide.prototype.site = function() {
      return 1;
    };

    OurSide.prototype.klass = function() {
      return 'ours';
    };

    OurSide.prototype.description = function() {
      return 'our changes';
    };

    OurSide.prototype.eventName = function() {
      return 'merge-conflicts:accept-ours';
    };

    return OurSide;

  })(Side);

  TheirSide = (function(_super) {
    __extends(TheirSide, _super);

    function TheirSide() {
      return TheirSide.__super__.constructor.apply(this, arguments);
    }

    TheirSide.prototype.site = function() {
      return 2;
    };

    TheirSide.prototype.klass = function() {
      return 'theirs';
    };

    TheirSide.prototype.description = function() {
      return 'their changes';
    };

    TheirSide.prototype.eventName = function() {
      return 'merge-conflicts:accept-theirs';
    };

    return TheirSide;

  })(Side);

  module.exports = {
    Side: Side,
    OurSide: OurSide,
    TheirSide: TheirSide
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tZXJnZS1jb25mbGljdHMvbGliL3NpZGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBTTtBQUNTLElBQUEsY0FBRSxZQUFGLEVBQWlCLEdBQWpCLEVBQXVCLE1BQXZCLEVBQWdDLGVBQWhDLEVBQWtELFFBQWxELEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxlQUFBLFlBQ2IsQ0FBQTtBQUFBLE1BRDJCLElBQUMsQ0FBQSxNQUFBLEdBQzVCLENBQUE7QUFBQSxNQURpQyxJQUFDLENBQUEsU0FBQSxNQUNsQyxDQUFBO0FBQUEsTUFEMEMsSUFBQyxDQUFBLGtCQUFBLGVBQzNDLENBQUE7QUFBQSxNQUQ0RCxJQUFDLENBQUEsV0FBQSxRQUM3RCxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQVosQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQURYLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxlQUFELEdBQW1CLElBRm5CLENBRFc7SUFBQSxDQUFiOztBQUFBLG1CQUtBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsUUFBUSxDQUFDLFNBQVYsQ0FBb0IsSUFBcEIsRUFBSDtJQUFBLENBTFQsQ0FBQTs7QUFBQSxtQkFPQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxVQUFWLEtBQXdCLEtBQTNCO0lBQUEsQ0FQWCxDQUFBOztBQUFBLG1CQVNBLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQUcsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFIO2VBQ0Usb0JBREY7T0FBQSxNQUVLLElBQUcsSUFBQyxDQUFBLE9BQUo7ZUFDSCxpQkFERztPQUFBLE1BQUE7ZUFHRixXQUFBLEdBQVUsQ0FBQyxJQUFDLENBQUEsS0FBRCxDQUFBLENBQUQsRUFIUjtPQUhJO0lBQUEsQ0FUWCxDQUFBOztBQUFBLG1CQWlCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQUcsQ0FBQyxJQUFDLENBQUEsTUFBRixFQUFVLElBQUMsQ0FBQSxlQUFYLEVBQUg7SUFBQSxDQWpCVCxDQUFBOztBQUFBLG1CQW1CQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSwyQkFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxZQUFZLENBQUMsT0FBZCxDQUFzQixRQUF0QixFQUFnQyxHQUFoQyxDQUFQLENBQUE7QUFDQSxNQUFBLElBQUcsSUFBSSxDQUFDLE1BQUwsR0FBYyxFQUFqQjtBQUNFLFFBQUEsSUFBQSxHQUFPLElBQUssYUFBTCxHQUFjLEtBQXJCLENBREY7T0FEQTtBQUFBLE1BR0EsU0FBQSxHQUFlLElBQUMsQ0FBQSxPQUFKLEdBQWlCLFFBQWpCLEdBQStCLEVBSDNDLENBQUE7QUFBQSxNQUlBLFVBQUEsR0FBZ0IsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFILEdBQXFCLFNBQXJCLEdBQW9DLEVBSmpELENBQUE7YUFLQyxHQUFBLEdBQUUsQ0FBQyxJQUFDLENBQUEsS0FBRCxDQUFBLENBQUQsQ0FBRixHQUFZLElBQVosR0FBZ0IsSUFBaEIsR0FBcUIsSUFBckIsR0FBeUIsU0FBekIsR0FBcUMsVUFBckMsR0FBZ0QsSUFOekM7SUFBQSxDQW5CVixDQUFBOztnQkFBQTs7TUFERixDQUFBOztBQUFBLEVBNkJNO0FBRUosOEJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHNCQUFBLElBQUEsR0FBTSxTQUFBLEdBQUE7YUFBRyxFQUFIO0lBQUEsQ0FBTixDQUFBOztBQUFBLHNCQUVBLEtBQUEsR0FBTyxTQUFBLEdBQUE7YUFBRyxPQUFIO0lBQUEsQ0FGUCxDQUFBOztBQUFBLHNCQUlBLFdBQUEsR0FBYSxTQUFBLEdBQUE7YUFBRyxjQUFIO0lBQUEsQ0FKYixDQUFBOztBQUFBLHNCQU1BLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFBRyw4QkFBSDtJQUFBLENBTlgsQ0FBQTs7bUJBQUE7O0tBRm9CLEtBN0J0QixDQUFBOztBQUFBLEVBdUNNO0FBRUosZ0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHdCQUFBLElBQUEsR0FBTSxTQUFBLEdBQUE7YUFBRyxFQUFIO0lBQUEsQ0FBTixDQUFBOztBQUFBLHdCQUVBLEtBQUEsR0FBTyxTQUFBLEdBQUE7YUFBRyxTQUFIO0lBQUEsQ0FGUCxDQUFBOztBQUFBLHdCQUlBLFdBQUEsR0FBYSxTQUFBLEdBQUE7YUFBRyxnQkFBSDtJQUFBLENBSmIsQ0FBQTs7QUFBQSx3QkFNQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQUcsZ0NBQUg7SUFBQSxDQU5YLENBQUE7O3FCQUFBOztLQUZzQixLQXZDeEIsQ0FBQTs7QUFBQSxFQWlEQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxJQUFBLEVBQU0sSUFBTjtBQUFBLElBQ0EsT0FBQSxFQUFTLE9BRFQ7QUFBQSxJQUVBLFNBQUEsRUFBVyxTQUZYO0dBbERGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/merge-conflicts/lib/side.coffee
