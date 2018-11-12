function EventScheduler (canvas, update) {

    // DIsable context menu
    canvas.oncontextmenu  = () => false;

    // Event attribute calculations
    this.isMousePressed = false;
    this.prevXPosition = 0;
    this.prevYPosition = 0;

    // Schedules Lists
    this.drag_schedules = [];
    this.key_down_schedules = [];
    this.mouse_wheel_schedules = [];
    this.key_press_schedules = {};

    // Active Events List
    this.active_events = {};

    canvas.addEventListener('mousedown', (event) => {
        this.isMousePressed = event.button;
        this.prevXPosition = event.x;
        this.prevYPosition = event.y;
    });
 
    document.addEventListener('mouseup', (event) => {
        this.isMousePressed = false;
    });

    document.addEventListener('keydown', (event) => {
        if (event.repeat) {
            return;
        }

        this.active_events[event.key] = true;
    });

    document.addEventListener('keyup', (event) => {
        this.active_events[event.key] = false;
    });

    canvas.addEventListener('mousemove', (event) => this.ondrag(event));
    document.addEventListener('keydown', (event) => this.keydown(event));
    document.addEventListener("mousewheel", (event) => this.mousewheel(event));

    /*
    * Start event loop - WOrk on the delay to make it once every 16ms
    */
    const EventLoop = () => {
        const active_events = Object.keys(this.active_events)
            .filter(key => this.active_events[key]);

        if (!active_events.length) {
            requestAnimationFrame(() => EventLoop());
            return;
        }

        for (const key of active_events) {
            if (this.key_press_schedules[key]) {
                for (const schedule of this.key_press_schedules[key]) {
                    schedule();
                }
            }
        }
        
        requestAnimationFrame(() => this.update());
        requestAnimationFrame(() => EventLoop());
    };

    requestAnimationFrame(() => EventLoop());

    this.update = update;
}

EventScheduler.prototype.ondrag = function (event) {
    if (this.isMousePressed === false) {
        return;
    }

    const variables = {
        delta_x: (event.x - this.prevXPosition) * 0.001,
        delta_y: -(event.y - this.prevYPosition) * 0.001,
        up: [0, 1, 0], right: [1, 0 , 0], back: [0, 0, 1],
        button: this.isMousePressed
    }

    for (const schedule of this.drag_schedules) {
        schedule(variables);
    }

    this.prevXPosition = event.x;
    this.prevYPosition = event.y;
    this.update();
}

EventScheduler.prototype.scheduleDrag = function (schedule) {
    this.drag_schedules.push(schedule);
}

EventScheduler.prototype.scheduleKeyPress = function (schedule, key) {
    if (!this.key_press_schedules[key]) {
        this.key_press_schedules[key] = [];
    }

    this.key_press_schedules[key].push(schedule);
}

EventScheduler.prototype.keydown = function (event) {
    const variables = {
        key: event.key
    }

    for (const schedule of this.key_down_schedules) {
        schedule(variables);
    }

    this.update();
}

EventScheduler.prototype.scheduleKeyDown = function (schedule) {
    this.key_down_schedules.push(schedule);
}

EventScheduler.prototype.scheduleInterval = function (schedule, timer) {
    setInterval(() => { schedule(); requestAnimationFrame(() => this.update()); }, timer);
}

EventScheduler.prototype.mousewheel = function (event) {
    const variables = {
        delta_z: Math.max(-1, Math.min(1, (event.wheelDelta || -event.deltaY || -event.detail)))
    }

    for (const schedule of this.mouse_wheel_schedules) {
        schedule(variables);
    }

    this.update();
}

EventScheduler.prototype.scheduleMouseWheel = function (schedule) {
    this.mouse_wheel_schedules.push(schedule);
}