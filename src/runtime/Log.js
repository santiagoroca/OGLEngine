const colors = require('colors');

module.exports = {

    enabled: true,

    enable: function () {
        this.enabled = true;
    },

    disable: function () {
        this.enabled = false;
    },

    log: function (log, level, depth = 0) {
        if (!this.enabled) {
            return;
        }

        if (level > LOG_LEVEL) {
            return;
        }

        const tabs = new Array(depth).fill('--').join('')
        switch (level) {
            case 4: {
                console.log(`${tabs} | ${log} `.green.bold);
            } break;
            case 5: {
                console.log(`${tabs}-> ${log} `.grey);
            } break;
        }
    }

}
