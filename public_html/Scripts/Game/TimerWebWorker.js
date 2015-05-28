var timerStart = true;
var minutes = 0;
var seconds = 0;
this.diff = 0;

function myTimer(d0)
{
    // get current time
    var d = (new Date()).valueOf();
    // calculate time difference between now and initial time
    diff = d - d0;
    // calculate number of minutes
    this.minutes = Math.floor(diff / 1000 / 60);
    // calculate number of seconds
    this.seconds = Math.floor(diff / 1000) - this.minutes * 60;
    var myVar = null;
    // if number of minutes less than 10, add a leading "0"
    this.minutes = this.minutes.toString();
    if (this.minutes.length === 1) {
        this.minutes = "0" + this.minutes;
    }
    // if number of seconds less than 10, add a leading "0"
    this.seconds = this.seconds.toString();
    if (this.seconds.length === 1) {
        this.seconds = "0" + this.seconds;
        postMessage(this.diff);
    }
}

self.onmessage = function (e)
{
    if (e.data === "start")
    {
        if (timerStart) {
            // get current time
            var d0 = (new Date()).valueOf();
            // repeat myTimer(d0) every 100 ms
            myVar = setInterval(function () {
                myTimer(d0);
            }, 100);
            // timer should not start anymore since it has been started
            timerStart = false;
        }
    }
    else if (e.data === "end")
    {
        // return output to Web Worker
        postMessage(this.diff);
        self.close();
    }
};