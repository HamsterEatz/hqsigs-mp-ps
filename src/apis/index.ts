import paradeStateApi from "./paradeStateApi";
import clearDataApi from "./clearDataApi";
import setNewWeekApi from "./setNewWeekApi";
import lockDataApi from "./lockDataApi";
import snapshotParadeStateApi from "./snapshotParadeStateApi";
import compareParadeStateApi from "./compareParadeStateApi";
import fetchDocsApi from "./fetchDocsApi";
import getUsersApi from "./getUsersApi";
import removeUserApi from "./removeUserApi";
import addUserApi from "./addUserApi";
import updateUserParadeStateApi from "./updateUserParadeStateApi";
import moment from "moment-timezone";

moment.tz.setDefault('Asia/Singapore');

export {
    paradeStateApi,
    clearDataApi,
    setNewWeekApi,
    lockDataApi,
    snapshotParadeStateApi,
    compareParadeStateApi,
    fetchDocsApi,
    getUsersApi,
    removeUserApi,
    addUserApi,
    updateUserParadeStateApi
};