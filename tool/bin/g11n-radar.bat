@if "%DEBUG%" == "" @echo off
@rem ##########################################################################
@rem
@rem  g11n-radar startup script for Windows
@rem
@rem ##########################################################################

@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal

set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%..
set APP_NAME=%~n0%~x0
set SAVED=%cd%

cd /d %SAVED%
@rem Add default JVM options here. You can also use JAVA_OPTS and G11N_RADAR_OPTS to pass JVM options to this script.
set DEFAULT_JVM_OPTS=

@rem Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if "%ERRORLEVEL%" == "0" goto init

echo.
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
echo.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.

goto fail

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe

if exist "%JAVA_EXE%" goto init

echo.
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME%
echo.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.

goto fail

:init
@rem Get command-line arguments, handling Windows variants

if not "%OS%" == "Windows_NT" goto win9xME_args

:win9xME_args
@rem Slurp the command line arguments.
set CMD_LINE_ARGS=
set _SKIP=2

:win9xME_args_slurp
if "x%~1" == "x" goto execute

set CMD_LINE_ARGS=%*

:execute
@rem Setup the command line
@rem FOR /f tokens^=2-5^ delims^=.-_^" %%j in ('"%JAVA_EXE%" -fullversion 2^>^&1') do @set "jver=%%j"
@rem IF %jver% GTR 8 (
@rem SET DEFAULT_JVM_OPTS="--add-opens=java.base/java.lang=ALL-UNNAMED %DEFAULT_JVM_OPTS%"
@rem )
set CLASSPATH=%APP_HOME%\plugin\*;%APP_HOME%\lib\radar-scanner-21.9.7.jar;%APP_HOME%\lib\icu4j-brief-65.1.jar;%APP_HOME%\lib\jmustache-1.15.jar;%APP_HOME%\lib\javax.json-1.1.4.jar;%APP_HOME%\lib\argparse4j-0.8.1.jar;%APP_HOME%\lib\snakeyaml-1.21.jar;%APP_HOME%\lib\logback-classic-1.2.3.jar;%APP_HOME%\lib\jsr305-3.0.2.jar;%APP_HOME%\lib\javax.inject-1.jar;%APP_HOME%\lib\logback-core-1.2.3.jar;%APP_HOME%\lib\slf4j-api-1.7.25.jar

@rem Execute g11n-radar
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% -Dapp.name=%APP_NAME% -Dapp.home=%APP_HOME% %G11N_RADAR_OPTS%  -classpath "%CLASSPATH%" net.citrite.gs.Radar %CMD_LINE_ARGS%

:end
@rem End local scope for the variables with windows NT shell
if "%ERRORLEVEL%"=="0" goto mainEnd

:fail
rem Set variable G11N_RADAR_EXIT_CONSOLE if you need the _script_ return code instead of
rem the _cmd.exe /c_ return code!
if  not "" == "%G11N_RADAR_EXIT_CONSOLE%" exit 1
exit /b 1

:mainEnd
if "%OS%"=="Windows_NT" endlocal

:omega
