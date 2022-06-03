"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOriginationOperation = exports.validateTransactionOperation = exports.validateRevealOperation = void 0;
/**
 * Check reveal operation metadata in runtime to prevent hidden failues
 */
function validateRevealOperation(operation) {
    ['public_key'].forEach(prop => checkPropertyWithError(operation, prop, 'validateRevealOperation'));
}
exports.validateRevealOperation = validateRevealOperation;
/**
 * Check transaction operation metadata in runtime to prevent hidden failues
 */
function validateTransactionOperation(operation) {
    ['amount', 'destination'].forEach(prop => checkPropertyWithError(operation, prop, 'validateTransactionOperation'));
}
exports.validateTransactionOperation = validateTransactionOperation;
/**
 * Check origination operation metadata in runtime to prevent hidden failues
 */
function validateOriginationOperation(operation) {
    ['balance', 'delegate'].forEach(prop => checkPropertyWithError(operation, prop, 'validateOriginationOperation'));
}
exports.validateOriginationOperation = validateOriginationOperation;
/**
 * Ensure that defined property exists in object and throw syntax error if not
 * @param o object to check
 * @param propName prop name
 * @param methodName user friendly method name for better error tracking
 */
function checkPropertyWithError(o, propName, methodName) {
    if (!o.hasOwnProperty(propName)) {
        const error = `[${methodName}] Object is missing required property "${propName}".`;
        console.error(error);
        throw new SyntaxError(error);
    }
}
//# sourceMappingURL=validation.js.map