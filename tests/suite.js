with(this) {
var isRhino;
if (typeof java == "undefined") {
	isRhino = false;
	var fs = require('fs');
	var args = process.argv.slice(0);
	args.shift();
	args.shift();
	var contents = fs.readFileSync(args[0], "utf-8");
	eval(contents);
	print = console.log;
} else {
	isRhino = true;
	args = arguments;
	load(args[0]);
}

QUnit.init();
QUnit.config.blocking = false;
QUnit.config.autorun = true;
QUnit.config.updateRate = 0;

QUnit.testStart = function(x) {
	print("  ", x.name);
}

QUnit.moduleStart = function(x) {
	print(x.name);
}

QUnit.log = function(entry) {
	if (entry.result) return;
	var message = entry.message;
	if (typeof message === "undefined") message = "";
    print("    ", entry.result ? 'PASS' : 'FAIL', message);
    if (!entry.result && entry.expected) {
    	if (entry.actual) {
    		print("      expected <"+entry.expected+ "> was <"+entry.actual+">");
    	} else {
    		print("      expected <"+entry.expected+ ">");
    	}
    }
};

var finalResults;
QUnit.done = function(results) {
	finalResults = results;
}

for (var i = 1; i < args.length; i++) {
	if (isRhino) {
		load(args[i]);
	} else {
		var contents = fs.readFileSync(args[i], 'utf-8');
		eval(contents);
	}
	
}

if (finalResults.failed) {
	print(finalResults.failed, "FAILED out of", finalResults.total, "total");
	isRhino ? java.lang.System.exit(1) : process.exit(1);
} else {
	print(finalResults.total, "PASSED");
}

}