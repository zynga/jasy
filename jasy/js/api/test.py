doc = """/**
 * Associates a verified email to the current user. The email address is assumed to be verfied email address from Facebook.
 *
 * - @email {String} The email address to be associated with the user.
 *
 *
 * Additional @options {Object?}:
 *
 *   - @options.zid {String?} If specified, will override the current user context.
 *   - @options.appId {String?} If specified, will override the current application context.
 *
 *
 * ### Example of an email address `foo@zynga.com` 
 *
 * Removing a associated E-Mail Address from a user:
 *
 *     zynga.api.Email.remove('foo@zynga.com').succes(function() {
 *         console.log('Email removed.');
 *
 *     }).error(function() {
 *         console.log('Email Could not be added.');
 *     });
 *
 * #proxy(zynga.util.DarwinPromise)
 *
 * You can think of `zynga.util.Emitter` as a kind of *interface*, all objects using
 * it provide the following methods:
 *
 *  - __bind(eventType, callback [, scope] [, once])__
 *
 *     Registers a callback function for the given `eventType`.
 *
 *     You can optionally pass in a context that will be used for the invocation
 *     of the callback function.
 *
 *     If once is `true`, the callback will be automatically unbound from the
 *     emitter after is was triggered the first time.
 *
 *          // Some code
 *
 *
 * hello world
 *
 */"""

doc = """/**
* {Object} Creates and configures a leaderboard. Once created, leaderboard configuration is immutable.
*
* > __Note: This call only works if it's made by either a admin or developer of the current application.__
*
* There are two primary types of leaderboard: `permenant` and `periodic`. A permenant leaderboard
* stores an all-time best score for each user. A periodic leaderboard stores scores for a
* subset of the recent past, such as "this week's top scores". By default, leaderboards are
* permenant.
*
* Periodic leaderboards can be created by setting the $periodUnits parameter to a non-default
* value. For example, a weekly leaderboard can be created by setting (@periodUnits to `'weeks'`).
*
* With this parameter set, the service divides all time into one week intervals. The
* beginning of time for this purpose is Sunday, `January 1st, 2012 PST. Every Saturday, at
* 11:59pm PST, the current period is discarded, and a fresh leaderboard is started.
*
* Valid values for @options.periodUnits are `'days'`, `'weeks'` and `'months'`.
*
* To specify a period longer than one day, week or month, pass in the @options.period parameter.
* E.g. @options.period: `3`, @options.periodUnits: `'months'` would create a leaderboard that resets once every three months.
*
* A periodic leaderboard can store more than one period worth of data, when the @options.periodCount
* parameter is set. Passing (@options.periodUnits: `'days'`, @options.periodCount: `7`)
* will create a leaderboard that tracks the best daily score for the last seven days.
*
*
* Parameters:
*
* - @metric {String} The name of the leaderboard being created.
*
*     This is an arbitrary string that must be unique on a per-game basis, it is used as a key to identify the leaderboard for all other API calls.
*
* Additional @options {Object?}:
*
* - @options.sort {String?} Sort order for the leaderboard: 'ascending' or 'descending'. Default: `'descending'`.
*
*     `'descending'` means higher scores are better than lower scores, and `'ascending'` means the opposite.
*
* - @options.periodUnits {String?} Periodic leaderboards may specify `'days'`, `'weeks'` or `'months'` to specify the length of their period intervals. The default value (`'infinite'`) creates a permenant leaderboard.
* - @options.period {Integer?} The length of a period interval is @options.period * @options.periodUnits. Default: `1`
* - @options.periodCount {Integer?} Queries on a periodic leaderboard will pull in @options.periodCount intervals.
* - @options.periodStart {Integer?} Starting timestamp for the first interval. Default: `1325404800` (Sun, 01 Jan 2012 08:00:00 GMT)
*
*
* ### Returns
*
* The call returns the configuration of the leaderboad that was created.
*
* If no optional arguments are specified, the data below will be the default return value:
*
*     {
*         sort: "descending",
*         periodUnits: "infinite"
*         period: 1,
*         periodCount: 1,
*         periodStart: 1325404800
*     }
*
* #proxy(zynga.util.DarwinPromise) #requiresInit
*/"""

from Comment import Comment

print('=' * 80)
e = Comment(doc)

print(e.getHtml(False))
print(e.getTags())

