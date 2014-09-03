@echo off
pushd "%~dp0"
set ANT="D:\Program Files\apache-ant\bin\ant.bat"
call %ANT% -buildfile build.xml
pause
exit