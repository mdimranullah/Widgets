define([
    "dojo/Evented",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/has",
    "esri/kernel",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/on",
    // load template    
    "dojo/text!application/dijit/templates/Odometer.html",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/event",
    "dojo/_base/array"
],
function (
    Evented,
    declare,
    lang,
    has, esriNS,
    _WidgetBase, _TemplatedMixin,
    on,
    dijitTemplate,
    domClass, domStyle, domConstruct,
    event,
    array
) {
    var odometerWidget = declare("esri.dijit.Odometer", [_WidgetBase, _TemplatedMixin, Evented], {
        templateString: dijitTemplate,
        // defaults
        options: {
            map: null,
            layers: null,
            visible: true,
            theme: null
        },
        // lifecycle: 1
        constructor: function(options, srcRefNode) {
            // mix in settings and defaults
            var defaults = lang.mixin({}, this.options, options);
            // widget node
            this.domNode = srcRefNode;
            // properties
            this.set("map", defaults.map);
            this.set("layers", defaults.layers);
            this.set("theme", defaults.theme);
            this.set("visible", defaults.visible);           
        },
        // start widget. called by user
        startup: function() {
            // map not defined
            if (!this.map) {
                this.destroy();
                console.log('Odometer::map required');
            }
            // when map is loaded
            if (this.map.loaded) {
                this._init();
            } else {
                on.once(this.map, "load", lang.hitch(this, function() {
                    this._init();
                }));
            }
        },
        // connections/subscriptions will be cleaned up during the destroy() lifecycle phase
        destroy: function() {
            this._removeEvents();
            this.inherited(arguments);
        },                
        _init: function () {
            connect(this.map, "onExtentChange", this, this._visible());
            //this._visible();
            //this._getresults();
            //this.set("loaded", true);
            //this.emit("load", {});
        },

        _visible: function() {
            if (this.get("visible")) {
                domStyle.set(this.domNode, 'display', 'block');
            } else {
                domStyle.set(this.domNode, 'display', 'none');
            }
        }
    });
    if (has("extend-esri")) {
        lang.setObject("dijit.Odometer", odometerWidget, esriNS);
    }
    return odometerWidget;
});