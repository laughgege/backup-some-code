; function Paging(total, current, container, callback) {
    this._total = total || 0;
    this._cur = current || 0;
    this._defShow = 5;
    this._show = this._defShow;
    this._pos = 0;
    this._container = jQuery(container);
    this._callback = callback;
    this._init();
}

Paging.prototype = {
    _init: function () {

        this._clsSelected = "sm-paging-selected",
		this._noIdPrefix = "sm_paging_number_";

        this._perLength = 24;

        var htm = jQuery('<div class="sm-paging"></div>');
        this._container.append(htm);

        this._left = jQuery('<a class="sm-paging-first" href="javascript://"><span class="sm-paging-left"></span><span class="sm-paging-left"></span></a>');
        htm.append(this._left);

        this._box = jQuery('<div class="sm-paging-number"><div></div></div>');
        htm.append(this._box);

        this._holder = this._box.children(":first");

        this._right = jQuery('<a class="sm-paging-last" href="javascript://"><span class="sm-paging-right"></span><span class="sm-paging-right"></span></a>');
        htm.append(this._right);

        this._text = jQuery('<span class="sm-paging-total"></span>');
        htm.append(this._text);

        this._attachEvents();
        this._setCurrent(this._cur, this._total);
    },
    _drawNumbers: function () {
        if (this._show > this._total) {
            this._show = this._total;
        }

        this._box.width(this._perLength * this._show);
        this._holder.width(this._perLength * this._total);

        var aList = [];
        for (var i = 1; i <= this._total; i++) {
            aList[aList.length] = this._printf('<a href="javascript://" class="{$cls}">{$i}</a>',
			{
			    cls: i === this._cur ? this._clsSelected : "",
			    id: this._noIdPrefix + i,
			    i: i
			});
        }

        this._holder.html(aList.join(""));
        this._container.find("a").focus(function () { this.blur() });
    },
    _attachEvents: function () {
        var self = this;
        this._left.click(function () {

            if (jQuery(this).hasClass("disabled")) {
                return;
            }

            var p = self._pos - self._show,
				min = 0;
            if (p < min) {
                p = min;
            }

            self._animateTo(p);
        });

        this._right.click(function () {

            if (jQuery(this).hasClass("disabled")) {
                return;
            }

            var p = self._pos + self._show,
				max = self._total - self._show;

            if (p > max) {
                p = max;
            }

            self._animateTo(p);
        });

        this._holder.click(function (e) {
            if (self._box.is(":animated")) {
                return;
            }

            var tar = e.target;

            if (tar.tagName !== "A") {
                return;
            }

            var no = parseInt(jQuery(tar).text());

            self._handleNoClick(no);
        });
    },
    _animateTo: function (p) {
        this._box.animate({ "scrollLeft": p * this._perLength }, 300);

        this._pos = p;
        this._checkBegin();
        this._checkEnd();
    },
    _checkBegin: function () {
        if (this._pos <= 0) {
            this._left.addClass("disabled");
        } else {
            this._left.removeClass("disabled");
        }
    },
    _checkEnd: function () {
        if (this._pos >= this._total - this._show) {
            this._right.addClass("disabled");
        } else {
            this._right.removeClass("disabled");
        }
    },
    _printf: function (temp, obj) {
        temp = temp == null ? "" : String(temp);

        return temp.replace(/\{\$(\w+)\}/g, function (s, k) {
            if (k in obj) {
                return obj[k];
            }
            else {
                return s;
            }
        });
    },
    _goTo: function (p) {
        this._box.scrollLeft(p * this._perLength);
        this._pos = p;
        this._checkBegin();
        this._checkEnd();
    },
    _updateTotalPage: function () {
        this._text.text("Pages: " + this._cur + " / " + this._total);
    },
    _handleNoClick: function (n) {

        if (this._cur === n) {
            return;
        }

        this._callback(n, this._total);
        //handle click
    },
    _setCurrent: function (n, total) {
        this._cur = n;

        this._total = total;
        this._show = Math.min(this._defShow, this._total);
        this._pos = (this._cur - 1) - (this._cur - 1) % this._show;
        this._drawNumbers();
        this._goTo(this._pos);

        this._updateTotalPage();
        this._trigger();
    },
    _trigger: function () {
        if (this._total <= 0) {
            this._container.hide();
        }
        else {
            this._container.show();
        }
    }
};