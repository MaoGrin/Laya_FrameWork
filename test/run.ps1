# 编译 Bag 模块 + 测试，并用 Node 运行（零第三方依赖）
# 用法：在项目根目录执行  .\test\run.ps1
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host ">>> compiling (tsconfig.test.json) ..."
tsc -p tsconfig.test.json
if ($LASTEXITCODE -ne 0) {
    Write-Host "compile failed, exit code $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host ">>> running tests ..."
node .test-out/test/BagTest.js
exit $LASTEXITCODE
