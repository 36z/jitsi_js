/* global Jitsi */

/** @class
 *
 *   @extends Jitsi.Base
 */
Jitsi.Service.Api = {
  /** @scope Jitsi.Service.Api */
  Calls: {
    CREATE: "CALL_CREATE",
    TERMINATE: "CALL_TERMINATE",
    REQUESTED: "CALL_REQUESTED",
    INVITE: "INVITE",
    TRANSFER: "TRANSFER_CALL",
    SEND_TONE: "SEND_TONE",
    MUTE: "MUTE",
    HOLD: "HOLD"
  },
  Register: {
    REGISTER: "REGISTER",
    UNREGISTER: "UNREGISTER"
  }
};
