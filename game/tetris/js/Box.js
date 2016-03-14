function Box() {
    var self = this;
    self.objectindex = ++LGlobal.objectIndex;
    self.box1 = [
        [0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0]
    ];
    self.box2 = [
        [0, 0, 0, 0],
		[0, 1, 1, 0],
        [0, 1, 1, 0],
		[0, 0, 0, 0]
    ];
    self.box3 = [
        [0, 0, 0, 0],
		[1, 1, 1, 0],
        [0, 1, 0, 0],
		[0, 0, 0, 0]
    ];
    self.box4 = [
        [0, 1, 1, 0],
		[0, 1, 0, 0],
        [0, 1, 0, 0],
		[0, 0, 0, 0]
    ];
    self.box5 = [
        [0, 1, 1, 0],
		[0, 0, 1, 0],
        [0, 0, 1, 0],
		[0, 0, 0, 0]
    ];
    self.box6 = [
        [0, 0, 0, 0],
		[0, 1, 0, 0],
        [0, 1, 1, 0],
		[0, 0, 1, 0]
    ];
    self.box7 = [
        [0, 0, 0, 0],
		[0, 0, 1, 0],
        [0, 1, 1, 0],
		[0, 1, 0, 0]
    ];
    self.box8 = [
        [0, 0, 0, 0],
		[0, 1, 0, 1],
        [0, 1, 1, 1],
		[0, 0, 0, 0]
    ];
    self.box9 = [
        [0, 0, 1, 0],
		[0, 0, 1, 0],
        [0, 1, 1, 1],
		[0, 0, 0, 0]
    ];
    self.box10 = [
        [1, 1, 1, 1],
		[1, 0, 0, 1],
        [1, 0, 0, 1],
		[1, 1, 1, 1]
    ];
    self.box0 = [self.box1, self.box2, self.box3, self.box4, self.box5, self.box6, self.box7, self.box8, self.box9, self.box3];
}
Box.prototype = {
    getBox: function () {
        var self = this;
        var num = self.box0.length * Math.random();
        var index = parseInt(num);
        return self.box0[index];
    }
}