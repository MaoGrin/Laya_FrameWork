/**
 * 极简测试夹具（零依赖，不引入任何 npm 包）。
 * 用 tsc 编译成 CommonJS 后，node 直接运行。
 */
declare const process: { exitCode: number };

let passed = 0;
let failed = 0;
const failures: string[] = [];

function fail(msg: string): never {
    throw new Error(msg);
}

export function assertEq(actual: any, expected: any, msg?: string): void {
    if (actual !== expected) {
        fail(`${msg ? msg + " — " : ""}期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}`);
    }
}

export function assertTrue(cond: boolean, msg?: string): void {
    if (!cond) fail(msg ?? "assertTrue 失败");
}

export function assertNull(v: any, msg?: string): void {
    if (v !== null && v !== undefined) {
        fail(`${msg ? msg + " — " : ""}期望 null/undefined，实际 ${JSON.stringify(v)}`);
    }
}

export function test(name: string, fn: () => void): void {
    try {
        fn();
        passed++;
        console.log(`  \u2713 ${name}`);
    } catch (e) {
        failed++;
        failures.push(name);
        console.log(`  \u2717 ${name}`);
        console.log(`      ${(e as Error).message}`);
    }
}

export function summary(title = "Bag 测试"): void {
    console.log(`\n==== ${title} ====`);
    console.log(`通过 ${passed} 项，失败 ${failed} 项`);
    if (failed > 0) {
        console.log("失败用例：");
        for (const f of failures) console.log("  - " + f);
        process.exitCode = 1;
    }
}
