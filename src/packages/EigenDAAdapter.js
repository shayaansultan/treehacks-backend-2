"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EigenDAAdapter = void 0;
var eigenda_sdk_1 = require("eigenda-sdk");
var EigenDAAdapter = /** @class */ (function () {
    function EigenDAAdapter(config) {
        this.logBuffer = [];
        this.isInitialized = false;
        this.pendingLogs = new Map();
        this.client = new eigenda_sdk_1.EigenDAClient({
            apiUrl: config.apiUrl,
            rpcUrl: config.rpcUrl,
            privateKey: config.privateKey,
            creditsContractAddress: config.creditsContractAddress,
        });
        this.flushInterval = config.flushInterval || 10000; // Default 10 seconds
        this.maxBufferSize = config.maxBufferSize || 1000; // Default 1000 logs
        this.config = config;
    }
    /**
     * Initialize the adapter and start the flush timer
     */
    EigenDAAdapter.prototype.initialize = function () {
        return __awaiter(this, arguments, void 0, function (minBalance) {
            var existingIdentifiers, _a, balance;
            if (minBalance === void 0) { minBalance = 0.001; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.isInitialized)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.client.getIdentifiers()];
                    case 1:
                        existingIdentifiers = _b.sent();
                        if (!(existingIdentifiers.length > 0)) return [3 /*break*/, 2];
                        this.identifier = existingIdentifiers[0];
                        return [3 /*break*/, 4];
                    case 2:
                        _a = this;
                        return [4 /*yield*/, this.client.createIdentifier()];
                    case 3:
                        _a.identifier = _b.sent();
                        _b.label = 4;
                    case 4:
                        if (!this.identifier) {
                            throw new Error('Failed to initialize identifier');
                        }
                        return [4 /*yield*/, this.client.getBalance(this.identifier)];
                    case 5:
                        balance = _b.sent();
                        if (!(balance < minBalance)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.client.topupCredits(this.identifier, minBalance)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        // Start periodic flush
                        this.startFlushTimer();
                        this.isInitialized = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    EigenDAAdapter.prototype.startFlushTimer = function () {
        var _this = this;
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }
        this.flushTimer = setInterval(function () { return _this.flush(); }, this.flushInterval);
    };
    /**
     * Stop the flush timer and flush any remaining logs
     */
    EigenDAAdapter.prototype.shutdown = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.flushTimer) {
                            clearInterval(this.flushTimer);
                            this.flushTimer = undefined;
                        }
                        return [4 /*yield*/, this.flush()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Log a message with the specified level
     */
    EigenDAAdapter.prototype.log = function (data, options) {
        return __awaiter(this, void 0, void 0, function () {
            var entry, tempId, logPromise;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isInitialized) {
                            throw new Error('Adapter not initialized. Call initialize() first.');
                        }
                        entry = {
                            level: ((options === null || options === void 0 ? void 0 : options.level) || 'info'),
                            message: typeof data === 'object' ? JSON.stringify(data) : String(data),
                            timestamp: Date.now(),
                            metadata: options === null || options === void 0 ? void 0 : options.metadata,
                            data: data,
                            options: options,
                        };
                        tempId = "temp-".concat(Date.now(), "-").concat(this.logBuffer.length + 1);
                        logPromise = new Promise(function (resolve) {
                            _this.pendingLogs.set(tempId, { resolve: resolve });
                        });
                        this.logBuffer.push(__assign(__assign({}, entry), { tempId: tempId }));
                        if (!(this.logBuffer.length >= this.maxBufferSize)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.flush()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, logPromise];
                }
            });
        });
    };
    // Convenience methods for different log levels
    EigenDAAdapter.prototype.info = function (message, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.log(message, { level: 'info', metadata: metadata })];
            });
        });
    };
    EigenDAAdapter.prototype.warn = function (message, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.log(message, { level: 'warn', metadata: metadata })];
            });
        });
    };
    EigenDAAdapter.prototype.error = function (message, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.log(message, { level: 'error', metadata: metadata })];
            });
        });
    };
    EigenDAAdapter.prototype.debug = function (message, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.log(message, { level: 'debug', metadata: metadata })];
            });
        });
    };
    /**
     * Flush buffered logs to EigenDA
     */
    EigenDAAdapter.prototype.flush = function () {
        return __awaiter(this, void 0, void 0, function () {
            var logsToFlush, batchedLogs, content, uploadResult, jobId, daStatus, _i, logsToFlush_1, log, pendingLog, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.logBuffer.length === 0)
                            return [2 /*return*/];
                        logsToFlush = __spreadArray([], this.logBuffer, true);
                        this.logBuffer = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        batchedLogs = {
                            logs: logsToFlush.map(function (log) { return ({
                                level: log.level,
                                message: log.message,
                                timestamp: log.timestamp,
                                metadata: log.metadata,
                                data: log.data,
                                options: log.options
                            }); }),
                            timestamp: Date.now(),
                            type: 'log_batch'
                        };
                        content = JSON.stringify(batchedLogs);
                        return [4 /*yield*/, this.client.upload(content, this.identifier)];
                    case 2:
                        uploadResult = _a.sent();
                        jobId = uploadResult.job_id;
                        if (!jobId) {
                            throw new Error('Failed to get job_id from upload result');
                        }
                        daStatus = {
                            type: 'eigenda',
                            data: {
                                jobId: jobId,
                                status: 'PENDING'
                            },
                            timestamp: Date.now(),
                        };
                        // Resolve all pending log promises with the real job ID
                        for (_i = 0, logsToFlush_1 = logsToFlush; _i < logsToFlush_1.length; _i++) {
                            log = logsToFlush_1[_i];
                            pendingLog = this.pendingLogs.get(log.tempId);
                            if (pendingLog) {
                                pendingLog.resolve({
                                    id: jobId,
                                    content: log.data,
                                    timestamp: log.timestamp,
                                    status: daStatus,
                                    options: log.options
                                });
                                this.pendingLogs.delete(log.tempId);
                            }
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error flushing logs to EigenDA:', error_1);
                        // Put the logs back in the buffer
                        this.logBuffer = __spreadArray(__spreadArray([], logsToFlush, true), this.logBuffer, true);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Store a log entry in EigenDA
     */
    EigenDAAdapter.prototype.storeLog = function (data, options) {
        return __awaiter(this, void 0, void 0, function () {
            var content, uploadResult, jobId, daStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.identifier) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        content = JSON.stringify({
                            data: data,
                            metadata: (options === null || options === void 0 ? void 0 : options.metadata) || {},
                            tags: (options === null || options === void 0 ? void 0 : options.tags) || [],
                            level: (options === null || options === void 0 ? void 0 : options.level) || 'info',
                            timestamp: Date.now(),
                        });
                        return [4 /*yield*/, this.client.upload(content, this.identifier)];
                    case 3:
                        uploadResult = _a.sent();
                        jobId = uploadResult.job_id;
                        if (!jobId) {
                            throw new Error('Failed to get job_id from upload result');
                        }
                        daStatus = {
                            type: 'eigenda',
                            data: {
                                jobId: jobId,
                                status: 'PENDING'
                            },
                            timestamp: Date.now(),
                        };
                        return [2 /*return*/, {
                                id: jobId,
                                content: data,
                                timestamp: Date.now(),
                                status: daStatus,
                                options: options,
                            }];
                }
            });
        });
    };
    /**
     * Check if a log entry is available in EigenDA
     */
    EigenDAAdapter.prototype.checkAvailability = function (status) {
        return __awaiter(this, void 0, void 0, function () {
            var daStatus, statusStr, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (status.type !== 'eigenda' || !status.data || typeof status.data !== 'object' || !('jobId' in status.data)) {
                            return [2 /*return*/, false];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.getStatus(status.data.jobId)];
                    case 2:
                        daStatus = _a.sent();
                        statusStr = String(daStatus);
                        return [2 /*return*/, ['CONFIRMED', 'completed'].includes(statusStr)];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error checking data availability:', error_2);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the current balance for the adapter's identifier
     */
    EigenDAAdapter.prototype.getBalance = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.identifier) {
                    throw new Error('Adapter not initialized. Call initialize() first.');
                }
                return [2 /*return*/, this.client.getBalance(this.identifier)];
            });
        });
    };
    /**
     * Post data to EigenDA
     */
    EigenDAAdapter.prototype.post = function (data, options) {
        return __awaiter(this, void 0, void 0, function () {
            var content, uploadResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.identifier) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        content = JSON.stringify({
                            data: data,
                            metadata: (options === null || options === void 0 ? void 0 : options.metadata) || {},
                            tags: (options === null || options === void 0 ? void 0 : options.tags) || [],
                            timestamp: Date.now(),
                        });
                        return [4 /*yield*/, this.client.upload(content, this.identifier)];
                    case 3:
                        uploadResult = _a.sent();
                        if (!(options === null || options === void 0 ? void 0 : options.waitForConfirmation)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.client.waitForStatus(uploadResult.jobId, 'CONFIRMED', 30, // max checks
                            20, // check interval (seconds)
                            60 // initial delay (seconds)
                            )];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, {
                            jobId: uploadResult.jobId,
                            content: data,
                            timestamp: Date.now(),
                        }];
                }
            });
        });
    };
    /**
     * Retrieve data by job ID
     */
    EigenDAAdapter.prototype.get = function (jobId) {
        return __awaiter(this, void 0, void 0, function () {
            var data, parsedData, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.retrieve({
                                jobId: jobId,
                                waitForCompletion: true
                            })];
                    case 1:
                        data = _a.sent();
                        parsedData = JSON.parse(data);
                        return [2 /*return*/, parsedData.data];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error retrieving data:', error_3);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the current identifier being used by the adapter
     */
    EigenDAAdapter.prototype.getIdentifier = function () {
        return this.identifier;
    };
    /**
     * Get the hex string representation of the current identifier
     */
    EigenDAAdapter.prototype.getIdentifierHex = function () {
        return this.identifier ? Buffer.from(this.identifier).toString('hex') : undefined;
    };
    /**
     * Get a specific log entry by ID
     */
    EigenDAAdapter.prototype.getLogEntry = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var data, batchedData, log, parsedData, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.get(id)];
                    case 1:
                        data = _a.sent();
                        if (!data)
                            return [2 /*return*/, null];
                        batchedData = data;
                        if (batchedData.type === 'log_batch' && Array.isArray(batchedData.logs)) {
                            log = batchedData.logs[0];
                            return [2 /*return*/, {
                                    id: id,
                                    content: log.data,
                                    timestamp: log.timestamp,
                                    status: {
                                        type: 'eigenda',
                                        data: {
                                            jobId: id,
                                            status: 'PENDING'
                                        },
                                        timestamp: log.timestamp,
                                    },
                                    options: log.options,
                                }];
                        }
                        parsedData = JSON.parse(String(data));
                        return [2 /*return*/, {
                                id: id,
                                content: parsedData.data,
                                timestamp: parsedData.timestamp,
                                status: {
                                    type: 'eigenda',
                                    data: {
                                        jobId: id,
                                        status: 'PENDING'
                                    },
                                    timestamp: parsedData.timestamp,
                                },
                                options: {
                                    level: parsedData.level,
                                    metadata: parsedData.metadata,
                                    tags: parsedData.tags,
                                },
                            }];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error retrieving log entry:', error_4);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return EigenDAAdapter;
}());
exports.EigenDAAdapter = EigenDAAdapter;
