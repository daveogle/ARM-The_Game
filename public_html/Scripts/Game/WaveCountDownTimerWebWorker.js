/*
 * Code adapted from http://frenticb.com/tricks/simple-timer.php
 * 
 * WaveCountDownTimerWebWorker counts down in seconds and posts back when the timer reaches 0
 */


var timerStart = true;
var totalTime;
var timeLeft;
var pause = false;

function myTimer(currentTime)
{
    // get current time
    var d = (new Date()).valueOf();
    // calculate time difference between now and initial time
    var diff = d - currentTime;
    //take this from the total time
    timeLeft = totalTime - diff;
    // calculate number of minutes
    var minutes = Math.floor(timeLeft / 1000 / 60);
    // calculate number of seconds
    var seconds = Math.floor(timeLeft / 1000) - minutes * 60;
    var myVar = null;
    // if number of minutes less than 10, add a leading "0"
    minutes = minutes.toString();
    if (minutes.length === 1) {
        minutes = "0" + minutes;
    }
    // if number of seconds less than 10, add a leading "0"
    seconds = seconds.toString();
    if (seconds.length === 1) {
        seconds = "0" + seconds;
    }
    // return output to Web Worker
    if (timeLeft < 0 || pause)
    {
        self.postMessage(timeLeft);
    }
    //console.log(minutes + ":" + seconds);
}

self.onmessage = function (e)
{
    if (e.data === "stop")
    {
//        console.log("stopping");
        pause = true;
    }
    else
    {
//        console.log("Starting");
        pause = false;
    }
    if (timerStart) {
        // get current time
        var currentTime = (new Date()).valueOf();
        //set the total time the timer is to be set for
        totalTime = e.data;
        timeLeft = totalTime;
        // repeat myTimer(d0) every 100 ms
        myVar = setInterval(function () {
            myTimer(currentTime);
            if (this.timeLeft < 0 || pause)
            {
                timerStart = true;
                clearInterval(myVar);
            }
        }, 100);
        // timer should not start anymore since it has been started
        timerStart = false;
    }
};