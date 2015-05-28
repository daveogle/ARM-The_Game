/**
 * Main Controller Class
 */
var startView;
var gameStart;

function onLoad()
{
    // First check whether Web Workers are supported
    if (typeof (Worker) === "undefined")
    {
        alert("Warning: Web Workers not supported by this browser, this may effect game functionality");
    }
    this.gameStart = false;
    this.startView = new StartView();
    this.startView.init();
}

function displayStartScreen(message, mute)
{
    this.gameStart = false;
    this.startView.drawSprites();
    this.startView.drawBackground();
    this.startView.drawMessage(message);
    this.startView.drawStartButton();
    this.startView.setMute(mute);
    this.startView.drawMuteButton();
}

function muteButtonClickedEventHandler()
{
    this.startView.drawMuteButton();
}

function getHelp(credits)
{
    this.startView.showHelpMessage(credits);
}

function getScrollMessage()
{
    if (!this.gameStart)
    {
        this.startView.scrollMessage();
    }
}

function startButtonClicked(canvas, stage, queue, mute)
{
    this.gameStart = true;
    startNewGame(canvas, stage, queue, mute);
}
//EOF
