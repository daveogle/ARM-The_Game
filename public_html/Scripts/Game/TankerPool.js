/* 
 * TankerPool Class
 */
function TankerPool(size)
{
    this.tanker = new Array(size);
}

TankerPool.prototype = {
    constructor: TankerPool,
    generateTankers: function ()
    {
        var tanker1 = new Tanker(0, 1000);
        var tanker2 = new Tanker(1, 5000);
        var tanker3 = new Tanker(2, 5000);
        var tanker4 = new Tanker(3, 10000);
        this.tanker[0] = tanker1;
        this.tanker[1] = tanker2;
        this.tanker[2] = tanker3;
        this.tanker[3] = tanker4;
    },
    getAllLevels: function()
    {
        var tankerLevels = new Array(this.tanker.length);
        for(var i = 0; i < this.tanker.length; i++)
        {
            tankerLevels[i] = this.tanker[i].getFuelLevel();
        }
        return tankerLevels;
    },
    isSelected: function (tanker)
    {
        for(var i = 0; i < this.tanker.length; i++)
        {
            this.tanker[i].setSelected(false);
        }
        this.tanker[(tanker -1)].setSelected(true);
    },
    getTanker: function (tanker)
    {
        return this.tanker[tanker];
    },
    bulkTanker: function (tanker)
    {
        this.tanker[tanker].setFuelLevel(this.tanker[tanker].getMaxLevel());
    },
};
//EOF
