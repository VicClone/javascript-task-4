'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = false;

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
                    count: 1
                });
            } else {
                const field = fieldEvent[eventCurrent].get(context);
                field.count += 1;
            }
            fieldEvent = fieldEvent[eventCurrent];
        }
    }

    function getLastFieldEvenst(arrEvents) {
        let fieldEvent = events;
        if (!fieldEvent[arrEvents[0]]) {
            return undefined;
        }
        for (const eventCurrent of arrEvents) {
            if (fieldEvent[eventCurrent]) {
                fieldEvent = fieldEvent[eventCurrent];
            }
        }

        return fieldEvent;
    }

    function getCorrectFieldForEmit(arrEvents) {
        let fieldEvent = events;
        if (!fieldEvent[arrEvents[0]]) {
            return undefined;
        }
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
            event.get(context).handler.call(context);
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
            const arrEvents = event.split('.');
            const fieldEvent = getLastFieldEvenst(arrEvents);
            fieldEvent.delete(context);

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
                    // console.log(events, 'after', arrEvents.length, arrEvents);
                }
                arrEvents.pop();
            }
            // console.log(correctEvent)
            // startEmit(getLastFieldEvenst(arrEvents[0]));

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
