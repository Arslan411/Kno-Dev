export enum Loading {
  idle = "idle",
  loading = "loading",
  error = "error",
}

export enum StatusCode {
  ok = 200,
  created = 201,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  internalServerError = 500,
}

export enum OrderStatus {
  NotCreated = "NotCreated",
  Created = "Created",
  NotApproved = "NotApproved",
  Shipped = "Shipped",
  PendingReceipt = "Pending Receipt",
  InLab = "In Lab",
  ResultsReady = "Results Ready",
  InMroReview = "InMroReview",
  PendingMroCcf = "PendingMroCcf",
  PendingAffidavit = "PendingAffidavit",
  DerNotificationRequired = "DerNotificationRequired",
  Released = "Released",
  Failed = "Failed", // error
  Exhausted = "Exhausted", // error
  CancelledDamaged = "Canceled Damaged", // error
  CancelledUnuseable = "Canceled Unuseable", // error
  CancelledVoided = "Canceled Voided", // error
  Retest = "Retest",
  LabReview = "LabReview",
  CynergyApiError = "CynergyApiError", // error
  PhysicianDetailsNotFound = "PhysicianDetailsNotFound", // error
  CustomerInTransit = "Customer - In Transit", // kno enroute
  CustomerOutForDelivery = "Customer - Out For Delivery", // kno enroute
  CustomerDelivered = "Customer - Delivered", // delivered
  CustomerDeliveryFailure = "Customer - Delivery Failure", // error
  CustomerDeliveryCancelled = "Customer - Delivery Cancelled", // error
  CustomerDeliveryError = "Customer - Delivery Error", // error
  CustomerReturnToSender = "Customer - Return To Sender", // error
  LabInTransit = "Lab - In Transit", // en route to lab
  LabOutForDelivery = "Lab - Out For Delivery", // en route to lab
  LabDelivered = "Lab - Delivered", // en route to lab
  LabDeliveryFailure = "Lab - Delivery Failure", // error
  LabDeliveryCancelled = "Lab - Delivery Cancelled", // error
  LabDeliveryError = "Lab - Delivery Error", // error
  LabReturnToSender = "Lab - Return To Sender", // error
}
