/**
 * jQuery.rollover
 *
 * @version    1.1.0
 * @author     Hiroshi Hoaki <rewish.org@gmail.com>
 * @author     Hisateru Tanaka <tanakahisateru@gmail.com>
 * @copyright  2010-2012 Hiroshi Hoaki, Hisateru Tanaka
 * @license    http://rewish.org/license/mit The MIT License
 * @link       http://rewish.org/javascript/jquery_rollover_plugin
 *
 * Usage:
 * jQuery(document).ready(function($) {
 *   // <img>
 *   $('#nav a img').rollover();
 *
 *   // <input type="image">
 *   $('form input:image').rollover();
 *
 *   // set suffix
 *   $('#nav a img').rollover('_over');
 *
 *   // like as .live (since 1.1.0)
 *   $('#dynamic-list a img').liveRollover();
 * });
 */
jQuery.fn.extend({
    rollover: function(suffix) {
        suffix = suffix || '_on';
        var check = new RegExp(suffix + '\\.\\w+$');
        return this.each(function() {
            var img = jQuery(this);
            var src = img.attr('src');
            if (check.test(src)) return;
            var _on = src.replace(/\.\w+$/, suffix + '$&');
            jQuery('<img>').attr('src', _on);
            img.hover(
                function() { img.attr('src', _on); },
                function() { img.attr('src', src); }
            );
        });
        return this;
    },
    liveRollover: function(suffix) {
        suffix = suffix || '_on';
        var check = new RegExp(suffix + '\\.\\w+$');
        function hoverOf(s){
            return s.replace(/\.\w+$/, suffix + '$&');
        }
        var $q = this;
        function preload(e) {
            var src = jQuery(e).attr('src');
            if (check.test(src)) {
                return;
            }
            jQuery('<img>').attr('src', hoverOf(src));
        }
        $q.each(function() {
            preload(this);
        });
        jQuery(document).bind('DOMNodeInserted', function(event) {
            // WARNING: selector is undocumented property
            jQuery($q.selector, event.target).each(function() {
                preload(this);
            });
        });
        this.live('mouseover', function() {
            var $this = jQuery(this);
            if (check.test($this.attr('src'))) {
                return;
            }
            var original = $this.data('rollover-original');
            if (!original) {
                original = $this.attr('src');
                $this.data('rollover-original', original);
            }
            $this.attr('src', hoverOf(original));
        });
        this.live('mouseout', function() {
            var $this = jQuery(this);
            var original = $this.data('rollover-original');
            if (!original) {
                return;
            }
            $this.attr('src', original);
        });
        return this;
    }
});