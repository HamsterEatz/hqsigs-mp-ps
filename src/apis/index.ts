import paradeStateApi from "./paradeStateApi";
import clearDataApi from "./clearDataApi";
import setNewWeekApi from "./setNewWeekApi";
import lockDataApi from "./lockDataApi";
import snapshotParadeStateApi from "./snapshotParadeStateApi";
import compareParadeStateApi from "./compareParadeStateApi";
import getUsersApi from "./getUsersApi";
import removeUserApi from "./removeUserApi";
import addUserApi from "./addUserApi";
import updateUsersParadeStateApi from "./updateUsersParadeStateApi";
import addNewCalendarEventApi from "./addNewCalendarEventApi";
import deleteCalendarEventApi from "./deleteCalendarEventApi";
import modifyUserRankApi from "./modifyUserRankApi";
import moment from "moment-timezone";

moment.tz.setDefault('Asia/Singapore');

export {
    paradeStateApi,
    clearDataApi,
    setNewWeekApi,
    lockDataApi,
    snapshotParadeStateApi,
    compareParadeStateApi,
    getUsersApi,
    removeUserApi,
    addUserApi,
    updateUsersParadeStateApi,
    addNewCalendarEventApi,
    deleteCalendarEventApi,
    modifyUserRankApi,
};