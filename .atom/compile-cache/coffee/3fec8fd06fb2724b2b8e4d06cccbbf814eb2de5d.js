(function() {
  var TwoDimArray;

  module.exports = TwoDimArray = (function() {
    function TwoDimArray(rows, cols) {
      this._arr = new Array(rows * cols);
      this.row = rows;
      this.col = cols;
      return;
    }

    TwoDimArray.prototype.getInd = function(row, col) {
      return row * this.col + col;
    };

    TwoDimArray.prototype.get2DInd = function(ind) {
      return {
        r: ind / this.col | 0,
        c: ind % this.col
      };
    };

    TwoDimArray.prototype.get = function(row, col) {
      return this._arr[this.getInd(row, col)];
    };

    TwoDimArray.prototype.set = function(row, col, val) {
      this._arr[row * this.col + col] = val;
    };

    TwoDimArray.prototype.rawGet = function(ind) {
      return this._arr[ind];
    };

    return TwoDimArray;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3LXBsdXMvbGliL3R3by1kaW0tYXJyYXkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBdUJBO0FBQUEsTUFBQSxXQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDUixJQUFBLHFCQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVksSUFBQSxLQUFBLENBQU0sSUFBQSxHQUFLLElBQVgsQ0FBWixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsR0FBRCxHQUFPLElBRFAsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLEdBQUQsR0FBTyxJQUZQLENBQUE7QUFHQSxZQUFBLENBSlc7SUFBQSxDQUFiOztBQUFBLDBCQU1BLE1BQUEsR0FBUSxTQUFDLEdBQUQsRUFBTSxHQUFOLEdBQUE7YUFDTixHQUFBLEdBQUksSUFBQyxDQUFBLEdBQUwsR0FBVyxJQURMO0lBQUEsQ0FOUixDQUFBOztBQUFBLDBCQVNBLFFBQUEsR0FBVSxTQUFDLEdBQUQsR0FBQTthQUNSO0FBQUEsUUFBQSxDQUFBLEVBQUcsR0FBQSxHQUFJLElBQUMsQ0FBQSxHQUFMLEdBQVcsQ0FBZDtBQUFBLFFBQ0EsQ0FBQSxFQUFHLEdBQUEsR0FBTSxJQUFDLENBQUEsR0FEVjtRQURRO0lBQUEsQ0FUVixDQUFBOztBQUFBLDBCQWFBLEdBQUEsR0FBSyxTQUFDLEdBQUQsRUFBTSxHQUFOLEdBQUE7YUFDSCxJQUFDLENBQUEsSUFBSyxDQUFBLElBQUMsQ0FBQSxNQUFELENBQVEsR0FBUixFQUFhLEdBQWIsQ0FBQSxFQURIO0lBQUEsQ0FiTCxDQUFBOztBQUFBLDBCQWdCQSxHQUFBLEdBQUssU0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsR0FBQTtBQUNILE1BQUEsSUFBQyxDQUFBLElBQUssQ0FBQSxHQUFBLEdBQUksSUFBQyxDQUFBLEdBQUwsR0FBVyxHQUFYLENBQU4sR0FBd0IsR0FBeEIsQ0FERztJQUFBLENBaEJMLENBQUE7O0FBQUEsMEJBb0JBLE1BQUEsR0FBUSxTQUFDLEdBQUQsR0FBQTthQUNOLElBQUMsQ0FBQSxJQUFLLENBQUEsR0FBQSxFQURBO0lBQUEsQ0FwQlIsQ0FBQTs7dUJBQUE7O01BREYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-preview-plus/lib/two-dim-array.coffee
