"use strict";
var AppViewModel_1 = require("../common/AppViewModel");
var color_1 = require("color");
var enums = require("ui/enums");
var label;
var shadow;
function onLayoutLoaded(args) {
    var layout = args.object;
    layout.backgroundColor = new color_1.Color('transparent');
    AppViewModel_1.appViewModel['getRecentLogItems'] = function () {
        updateLogListener(AppViewModel_1.appViewModel.layerDetails.log);
        return label.text;
    };
    AppViewModel_1.appViewModel.on('propertyChange', function (args) {
        if (args.propertyName === 'debugEnabled') {
            updateLogListener(AppViewModel_1.appViewModel.layerDetails.log);
        }
    });
    layout.bindingContext = AppViewModel_1.appViewModel;
}
exports.onLayoutLoaded = onLayoutLoaded;
function onLoaded(args) {
    label = args.object;
    label.verticalAlignment = enums.VerticalAlignment.bottom;
}
exports.onLoaded = onLoaded;
function onShadowLoaded(args) {
    shadow = args.object;
    shadow.verticalAlignment = enums.VerticalAlignment.bottom;
    shadow.translateX = 0.5;
    shadow.translateY = 0.5;
}
exports.onShadowLoaded = onShadowLoaded;
var currentLog;
function updateLogListener(log) {
    if (log === currentLog && AppViewModel_1.appViewModel.debugEnabled)
        return;
    if (currentLog) {
        currentLog.removeEventListener("change", updateLog);
        currentLog = undefined;
    }
    if (!log || !AppViewModel_1.appViewModel.debugEnabled)
        return;
    log.addEventListener('change', updateLog);
    currentLog = log;
    updateLog();
}
function updateLog() {
    if (currentLog && currentLog.length > 0) {
        var lines = [];
        loop: for (var l = currentLog.length - 1; l >= 0; l--) {
            var log = currentLog.getItem(l);
            lines.unshift.apply(lines, log.lines);
            if (lines.length > 50)
                break loop;
        }
        label.text = lines.join('\n');
        shadow.text = label.text;
    }
    else {
        label.text = "";
        shadow.text = "";
    }
}
