/* 
 * Driver Class
 */

function Driver(id, name, description, avatar, nextLevelCost)
{
    var idNumber;
    var name;
    var avatar;
    var description;
    var maxLevel;
    var currentLevel;
    var canLevelUp;
    var nextLevelCost;
    var selected;
    var busy;

    this.idNumber = id;
    this.name = name;
    this.description = description;
    this.avatar = avatar;
    this.maxLevel = 10;
    this.currentLevel = 1;
    this.canLevelUp = false;
    this.nextLevelCost = nextLevelCost;
    this.selected = false;
    this.busy = false;
}

Driver.prototype = {
    constructor: Driver,
    getAvatar: function ()
    {
        return this.avatar;
    },
    setAvatar: function (avatar)
    {
        this.avatar = avatar;
    },
    getId: function ()
    {
        return this.idNumber;
    },
    setId: function (id)
    {
        this.idNumber = id;
    },
    getName: function ()
    {
        return this.name;
    },
    setName: function (name)
    {
        this.name = name;
    },
    getDescription: function ()
    {
        return this.description;
    },
    setDescription: function (description)
    {
        this.description = description;
    },
    getMaxLevel: function ()
    {
        return this.maxLevel;
    },
    setMaxLevel: function (maxLevel)
    {
        this.maxLevel = maxLevel;
    },
    getCurrentLevel: function ()
    {
        return this.currentLevel;
    },
    setCurrentLevel: function (level)
    {
        this.currentLevel = level;
    },
    setNextLevel: function ()
    {
        if (this.currentLevel !== this.maxLevel)
        {
            this.currentLevel++;
        }
    },
    getCanLevelUp: function ()
    {
        return this.canLevelUp;
    },
    setCanLevelUp: function (canLevelUp)
    {
        this.canLevelUp = canLevelUp;
    },
    getNextLevelCost: function ()
    {
        return this.nextLevelCost;
    },
    setNextLevelCost: function (cost)
    {
        this.nextLevelCost = cost;
    },
    getSelected: function ()
    {
        return this.selected;
    },
    setSelected: function (selected)
    {
        this.selected = selected;
    },
    getBusy: function ()
    {
        return this.busy;
    },
    setBusy: function (busy)
    {
        if (busy)
        {
            this.canLevelUp = false;
        }
        this.selected = false;
        this.busy = busy;
    }
};
//EOF
