'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */

function getEmitter() {

    const events = {};

    function subsribe(event, context, handler) {
        const arrEvents = event.split('.');
        let fieldEvent = events;
        for (let eventCurrent of arrEvents) {
            if (!fieldEvent[eventCurrent]) {
                fieldEvent[eventCurrent] = new Map();
            }
            if (!fieldEvent[eventCurrent].has(context)) {
                fieldEvent[eventCurrent].set(context, {
                    handler: handler,
                    count: 0,
                    times: arguments[3] || Infinity,
                    frequency: arguments[4] || 1
                });
            }
            fieldEvent = fieldEvent[eventCurrent];
        }
    }

    function getCorrectFieldForEmit(arrEvents) {
        let fieldEvent = events;
        for (const eventCurrent of arrEvents) {
            if (fieldEvent[eventCurrent]) {
                fieldEvent = fieldEvent[eventCurrent];
            } else {
                return undefined;
            }
        }

        return fieldEvent;
    }

    function startEmit(event) {
        if (!event) {
            return;
        }
        for (const context of event.keys()) {
            const countEvent = event.get(context).count;
            let timeEvent = event.get(context).times;
            let frequencyEvent = event.get(context).frequency;
            if ((countEvent < timeEvent) && !(countEvent % frequencyEvent)) {
                event.get(context).handler.call(context);
            }
            event.get(context).count++;
        }
    }

    function unsubscribe(field, context) {
        let newField = field;
        for (const nextField in newField) {
            if (newField[nextField]) {
                newField[nextField].delete(context);
                newField = newField[nextField];
            }
        }
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            subsribe(event, context, handler);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} this
         */
        off: function (event, context) {
            const eventsArr = event.split('.');
            let field = events;
            for (const eventCurrent of eventsArr) {
                field = field[eventCurrent];
            }
            unsubscribe(field, context);
            if (field) {
                field.delete(context);
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            const arrEvents = event.split('.');
            while (arrEvents.length !== 0) {
                const correctEvent = getCorrectFieldForEmit(arrEvents);
                if (correctEvent) {
                    startEmit(correctEvent);
                }
                arrEvents.pop();
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object} this
         */
        several: function (event, context, handler, times) {
            times = times <= 0 ? Infinity : times;
            subsribe(event, context, handler, times);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object} this
         */
        through: function (event, context, handler, frequency) {
            frequency = frequency <= 0 ? 1 : frequency;
            subsribe(event, context, handler, undefined, frequency);

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
