var NoAccessPermission = {
    success: false,
    message: "No Access Permission...",
    data: "AccessPermission"
};
var InvalidToken = {
    success: false,
    message: "Invalid token...",
    data: "TOKEN"
};
var NotDeleteReferenceData = {
    success: false,
    message: "This Record Can't Deleted, It Contain References to other data..."
};
var RecordNotFound = {
    success: false,
    message: "Requested Record(s) not Found....",
    data: null
};
module.exports = {
    NoAccessPermission: NoAccessPermission,
    InvalidToken: InvalidToken,
    NotDeleteReferenceData: NotDeleteReferenceData,
    RecordNotFound: RecordNotFound
};