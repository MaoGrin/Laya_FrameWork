"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summary = exports.test = exports.assertNull = exports.assertTrue = exports.assertEq = void 0;
let passed = 0;
let failed = 0;
const failures = [];
function fail(msg) {
    throw new Error(msg);
}
function assertEq(actual, expected, msg) {
    if (actual !== expected) {
        fail(`${msg ? msg + " — " : ""}期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}`);
    }
}
exports.assertEq = assertEq;
function assertTrue(cond, msg) {
    if (!cond)
        fail(msg ?? "assertTrue 失败");
}
exports.assertTrue = assertTrue;
function assertNull(v, msg) {
    if (v !== null && v !== undefined) {
        fail(`${msg ? msg + " — " : ""}期望 null/undefined，实际 ${JSON.stringify(v)}`);
    }
}
exports.assertNull = assertNull;
function test(name, fn) {
    try {
        fn();
        passed++;
        console.log(`  \u2713 ${name}`);
    }
    catch (e) {
        failed++;
        failures.push(name);
        console.log(`  \u2717 ${name}`);
        console.log(`      ${e.message}`);
    }
}
exports.test = test;
function summary(title = "Bag 测试") {
    console.log(`\n==== ${title} ====`);
    console.log(`通过 ${passed} 项，失败 ${failed} 项`);
    if (failed > 0) {
        console.log("失败用例：");
        for (const f of failures)
            console.log("  - " + f);
        process.exitCode = 1;
    }
}
exports.summary = summary;
