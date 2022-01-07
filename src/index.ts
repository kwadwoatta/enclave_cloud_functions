// import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";

import generateThumbs from "./exports/generateThumbs";
import isVendorNumberActive from "./exports/isVendorNumberActive";
import setAsVendor from "./exports/setAsVendor";
import setAsScout from "./exports/setAsScout";
import canVendorSignIn from "./exports/canVendorSignIn";
import canScoutSignIn from "./exports/canScoutSignIn";
import createVendor from "./exports/createVendor";
import setPhotoUrl from "./exports/setPhotoUrl";
import createScout from "./exports/createScout";
import payForRequestedSpace from "./exports/payForRequestedSpace";
import payToPostEvent from "./exports/payToPostEvent";

//* admin.initializeApp(functions.config().firebase);

//* Generate thumbnails of images when uploaded to storage
exports.generateThumbs = generateThumbs;

//* Create Vendor
exports.createVendor = createVendor;

//* Create Vendor
exports.createScout = createScout;

//* Set user photo url
exports.setPhotoUrl = setPhotoUrl;

//* Check if vendor's phone number is already signed up
exports.isVendorNumberActive = isVendorNumberActive;

//* Set user as vendor
exports.setAsVendor = setAsVendor;

//* Set user as scout
exports.setAsScout = setAsScout;

//* Check if user can sign in as vendor
exports.canVendorSignIn = canVendorSignIn;

//* Check if user can sign in as scout
exports.canScoutSignIn = canScoutSignIn;

//* Pay for requested space
exports.payForRequestedSpace = payForRequestedSpace;

//* Make payment to enclave to post event
exports.payToPostEvent = payToPostEvent;
